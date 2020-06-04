package ics23

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"path/filepath"
	"testing"
)

// TestVector is what is stored in the file
type TestVector struct {
	RootHash string `json:"root"`
	Proof    string `json:"proof"`
	Key      string `json:"key"`
	Value    string `json:"value"`
}

// RefData is parsed version of everything except the CommitmentProof itself
type RefData struct {
	RootHash []byte
	Key      []byte
	Value    []byte
}

func TestVectors(t *testing.T) {

	iavl := filepath.Join("..", "testdata", "iavl")
	tendermint := filepath.Join("..", "testdata", "tendermint")
	cases := []struct {
		dir      string
		filename string
		spec     *ProofSpec
	}{
		{dir: iavl, filename: "exist_left.json", spec: IavlSpec},
		{dir: iavl, filename: "exist_right.json", spec: IavlSpec},
		{dir: iavl, filename: "exist_middle.json", spec: IavlSpec},
		{dir: iavl, filename: "nonexist_left.json", spec: IavlSpec},
		{dir: iavl, filename: "nonexist_right.json", spec: IavlSpec},
		{dir: iavl, filename: "nonexist_middle.json", spec: IavlSpec},
		{dir: tendermint, filename: "exist_left.json", spec: TendermintSpec},
		{dir: tendermint, filename: "exist_right.json", spec: TendermintSpec},
		{dir: tendermint, filename: "exist_middle.json", spec: TendermintSpec},
		{dir: tendermint, filename: "nonexist_left.json", spec: TendermintSpec},
		{dir: tendermint, filename: "nonexist_right.json", spec: TendermintSpec},
		{dir: tendermint, filename: "nonexist_middle.json", spec: TendermintSpec},
	}

	for _, tc := range cases {
		tc := tc
		name := fmt.Sprintf("%s/%s", tc.dir, tc.filename)
		t.Run(name, func(t *testing.T) {
			proof, ref := loadFile(t, tc.dir, tc.filename)
			// Test Calculate method
			calculatedRoot, err := proof.Calculate()
			if err != nil {
				t.Fatal("proof.Calculate() returned error")
			}
			if !bytes.Equal(ref.RootHash, calculatedRoot) {
				t.Fatalf("calculated root: %X did not match expected root: %X", calculatedRoot, ref.RootHash)
			}
			// Test Verify method
			if ref.Value == nil {
				// non-existence
				valid := VerifyNonMembership(tc.spec, ref.RootHash, proof, ref.Key)
				if !valid {
					t.Fatal("Invalid proof")
				}
			} else {
				valid := VerifyMembership(tc.spec, ref.RootHash, proof, ref.Key, ref.Value)
				if !valid {
					t.Fatal("Invalid proof")
				}
			}
		})
	}
}

func loadFile(t *testing.T, dir string, filename string) (*CommitmentProof, *RefData) {
	// load the file into a json struct
	name := filepath.Join(dir, filename)
	bz, err := ioutil.ReadFile(name)
	if err != nil {
		t.Fatalf("Read file: %+v", err)
	}
	var data TestVector
	err = json.Unmarshal(bz, &data)
	if err != nil {
		t.Fatalf("Unmarshal json: %+v", err)
	}

	// parse the protobuf object
	var proof CommitmentProof
	err = proof.Unmarshal(mustHex(t, data.Proof))
	if err != nil {
		t.Fatalf("Unmarshal protobuf: %+v", err)
	}

	var ref RefData
	ref.RootHash = CommitmentRoot(mustHex(t, data.RootHash))
	ref.Key = mustHex(t, data.Key)
	if data.Value != "" {
		ref.Value = mustHex(t, data.Value)
	}

	return &proof, &ref
}

func buildBatch(t *testing.T, dir string, filenames []string) (*CommitmentProof, []*RefData) {
	refs := make([]*RefData, len(filenames))
	proofs := make([]*CommitmentProof, len(filenames))

	for i, fn := range filenames {
		proofs[i], refs[i] = loadFile(t, dir, fn)
	}

	batch, err := CombineProofs(proofs)
	if err != nil {
		t.Fatalf("Generating batch: %v", err)
	}
	return batch, refs
}

// BatchVector is what is stored in the file
type BatchVector struct {
	RootHash string `json:"root"`
	Proof    string `json:"proof"`
	Items    []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	}
}

func loadBatch(t *testing.T, dir string, filename string) (*CommitmentProof, []*RefData) {
	// load the file into a json struct
	name := filepath.Join(dir, filename)
	bz, err := ioutil.ReadFile(name)
	if err != nil {
		t.Fatalf("Read file: %+v", err)
	}
	var data BatchVector
	err = json.Unmarshal(bz, &data)
	if err != nil {
		t.Fatalf("Unmarshal json: %+v", err)
	}

	// parse the protobuf object
	var proof CommitmentProof
	err = proof.Unmarshal(mustHex(t, data.Proof))
	if err != nil {
		t.Fatalf("Unmarshal protobuf: %+v", err)
	}

	root := mustHex(t, data.RootHash)

	var refs = make([]*RefData, len(data.Items))
	for i, item := range data.Items {
		refs[i] = &RefData{
			RootHash: root,
			Key:      mustHex(t, item.Key),
			Value:    mustHex(t, item.Value),
		}
	}

	return &proof, refs
}

func TestBatchVectors(t *testing.T) {
	iavl := filepath.Join("..", "testdata", "iavl")
	tendermint := filepath.Join("..", "testdata", "tendermint")

	// Note that each item has a different commitment root,
	// so maybe not ideal (cannot check multiple entries)
	batch_iavl, refs_iavl := buildBatch(t, iavl, []string{
		"exist_left.json",
		"exist_right.json",
		"exist_middle.json",
		"nonexist_left.json",
		"nonexist_right.json",
		"nonexist_middle.json",
	})

	batch_tm, refs_tm := buildBatch(t, tendermint, []string{
		"exist_left.json",
		"exist_right.json",
		"exist_middle.json",
		"nonexist_left.json",
		"nonexist_right.json",
		"nonexist_middle.json",
	})

	batch_tm_exist, refs_tm_exist := loadBatch(t, tendermint, "batch_exist.json")
	batch_tm_nonexist, refs_tm_nonexist := loadBatch(t, tendermint, "batch_nonexist.json")

	batch_iavl_exist, refs_iavl_exist := loadBatch(t, iavl, "batch_exist.json")
	batch_iavl_nonexist, refs_iavl_nonexist := loadBatch(t, iavl, "batch_nonexist.json")

	cases := map[string]struct {
		spec    *ProofSpec
		proof   *CommitmentProof
		ref     *RefData
		invalid bool // default is valid
	}{
		"iavl 0": {spec: IavlSpec, proof: batch_iavl, ref: refs_iavl[0]},
		"iavl 1": {spec: IavlSpec, proof: batch_iavl, ref: refs_iavl[1]},
		"iavl 2": {spec: IavlSpec, proof: batch_iavl, ref: refs_iavl[2]},
		"iavl 3": {spec: IavlSpec, proof: batch_iavl, ref: refs_iavl[3]},
		"iavl 4": {spec: IavlSpec, proof: batch_iavl, ref: refs_iavl[4]},
		"iavl 5": {spec: IavlSpec, proof: batch_iavl, ref: refs_iavl[5]},
		// Note this spec only differs for non-existence proofs
		"iavl invalid 1":      {spec: TendermintSpec, proof: batch_iavl, ref: refs_iavl[4], invalid: true},
		"iavl invalid 2":      {spec: IavlSpec, proof: batch_iavl, ref: refs_tm[0], invalid: true},
		"iavl batch exist":    {spec: IavlSpec, proof: batch_iavl_exist, ref: refs_iavl_exist[17]},
		"iavl batch nonexist": {spec: IavlSpec, proof: batch_iavl_nonexist, ref: refs_iavl_nonexist[7]},
		"tm 0":                {spec: TendermintSpec, proof: batch_tm, ref: refs_tm[0]},
		"tm 1":                {spec: TendermintSpec, proof: batch_tm, ref: refs_tm[1]},
		"tm 2":                {spec: TendermintSpec, proof: batch_tm, ref: refs_tm[2]},
		"tm 3":                {spec: TendermintSpec, proof: batch_tm, ref: refs_tm[3]},
		"tm 4":                {spec: TendermintSpec, proof: batch_tm, ref: refs_tm[4]},
		"tm 5":                {spec: TendermintSpec, proof: batch_tm, ref: refs_tm[5]},
		// Note this spec only differs for non-existence proofs
		"tm invalid 1":      {spec: IavlSpec, proof: batch_tm, ref: refs_tm[4], invalid: true},
		"tm invalid 2":      {spec: TendermintSpec, proof: batch_tm, ref: refs_iavl[0], invalid: true},
		"tm batch exist":    {spec: TendermintSpec, proof: batch_tm_exist, ref: refs_tm_exist[10]},
		"tm batch nonexist": {spec: TendermintSpec, proof: batch_tm_nonexist, ref: refs_tm_nonexist[3]},
	}

	for name, tc := range cases {
		tc := tc
		t.Run(name, func(t *testing.T) {
			// try one proof
			if tc.ref.Value == nil {
				// non-existence
				valid := VerifyNonMembership(tc.spec, tc.ref.RootHash, tc.proof, tc.ref.Key)
				if valid == tc.invalid {
					t.Fatalf("Expected proof validity: %t", !tc.invalid)
				}
				keys := [][]byte{tc.ref.Key}
				valid = BatchVerifyNonMembership(tc.spec, tc.ref.RootHash, tc.proof, keys)
				if valid == tc.invalid {
					t.Fatalf("Expected batch proof validity: %t", !tc.invalid)
				}
			} else {
				valid := VerifyMembership(tc.spec, tc.ref.RootHash, tc.proof, tc.ref.Key, tc.ref.Value)
				if valid == tc.invalid {
					t.Fatalf("Expected proof validity: %t", !tc.invalid)
				}
				items := make(map[string][]byte)
				items[string(tc.ref.Key)] = tc.ref.Value
				valid = BatchVerifyMembership(tc.spec, tc.ref.RootHash, tc.proof, items)
				if valid == tc.invalid {
					t.Fatalf("Expected batch proof validity: %t", !tc.invalid)
				}
			}
		})
	}
}

func TestDecompressBatchVectors(t *testing.T) {
	iavl := filepath.Join("..", "testdata", "iavl")
	tendermint := filepath.Join("..", "testdata", "tendermint")

	// note that these batches are already compressed
	batch_iavl, _ := loadBatch(t, iavl, "batch_exist.json")
	batch_tm, _ := loadBatch(t, tendermint, "batch_nonexist.json")

	cases := map[string]struct {
		batch *CommitmentProof
	}{
		"iavl":       {batch: batch_iavl},
		"tendermint": {batch: batch_tm},
	}

	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			small, err := tc.batch.Marshal()
			if err != nil {
				t.Fatalf("Marshal batch %v", err)
			}

			decomp := Decompress(tc.batch)
			if decomp == tc.batch {
				t.Fatalf("Decompression is a no-op")
			}
			big, err := decomp.Marshal()
			if err != nil {
				t.Fatalf("Marshal batch %v", err)
			}
			if len(small) >= len(big) {
				t.Fatalf("Compression doesn't reduce size")
			}

			restore := Compress(tc.batch)
			resmall, err := restore.Marshal()
			if err != nil {
				t.Fatalf("Marshal batch %v", err)
			}
			if len(resmall) != len(small) {
				t.Fatalf("Decompressed len %d, original len %d", len(resmall), len(small))
			}
			if !bytes.Equal(resmall, small) {
				t.Fatal("Decompressed batch proof differs from original")
			}

		})
	}
}

func mustHex(t *testing.T, data string) []byte {
	if data == "" {
		return nil
	}
	res, err := hex.DecodeString(data)
	if err != nil {
		t.Fatalf("decoding hex: %v", err)
	}
	return res
}
