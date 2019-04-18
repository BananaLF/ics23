/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proofs = (function() {

    /**
     * Namespace proofs.
     * @exports proofs
     * @namespace
     */
    var proofs = {};

    /**
     * HashOp enum.
     * @name proofs.HashOp
     * @enum {string}
     * @property {number} NO_HASH=0 NO_HASH value
     * @property {number} SHA256=1 SHA256 value
     * @property {number} SHA512=2 SHA512 value
     * @property {number} KECCAK=3 KECCAK value
     */
    proofs.HashOp = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NO_HASH"] = 0;
        values[valuesById[1] = "SHA256"] = 1;
        values[valuesById[2] = "SHA512"] = 2;
        values[valuesById[3] = "KECCAK"] = 3;
        return values;
    })();

    /**
     * LengthOp defines how to process the key and value of the LeafOp
     * to include length information. After encoding the length with the given
     * algorithm, the length will be prepended to the key and value bytes.
     * (Each one with it's own encoded length)
     * @name proofs.LengthOp
     * @enum {string}
     * @property {number} NO_PREFIX=0 NO_PREFIX value
     * @property {number} VAR_PROTO=1 VAR_PROTO value
     * @property {number} VAR_RLP=2 VAR_RLP value
     * @property {number} FIXED32_BIG=3 FIXED32_BIG value
     * @property {number} FIXED32_LITTLE=4 FIXED32_LITTLE value
     * @property {number} FIXED64_BIG=5 FIXED64_BIG value
     * @property {number} FIXED64_LITTLE=6 FIXED64_LITTLE value
     * @property {number} REQUIRE_32_BYTES=7 REQUIRE_32_BYTES value
     * @property {number} REQUIRE_64_BYTES=8 REQUIRE_64_BYTES value
     */
    proofs.LengthOp = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NO_PREFIX"] = 0;
        values[valuesById[1] = "VAR_PROTO"] = 1;
        values[valuesById[2] = "VAR_RLP"] = 2;
        values[valuesById[3] = "FIXED32_BIG"] = 3;
        values[valuesById[4] = "FIXED32_LITTLE"] = 4;
        values[valuesById[5] = "FIXED64_BIG"] = 5;
        values[valuesById[6] = "FIXED64_LITTLE"] = 6;
        values[valuesById[7] = "REQUIRE_32_BYTES"] = 7;
        values[valuesById[8] = "REQUIRE_64_BYTES"] = 8;
        return values;
    })();

    proofs.ExistenceProof = (function() {

        /**
         * Properties of an ExistenceProof.
         * @memberof proofs
         * @interface IExistenceProof
         * @property {Uint8Array|null} [key] ExistenceProof key
         * @property {Uint8Array|null} [value] ExistenceProof value
         * @property {Array.<proofs.IProofOp>|null} [steps] ExistenceProof steps
         */

        /**
         * Constructs a new ExistenceProof.
         * @memberof proofs
         * @classdesc ExistenceProof takes a key and a value and a set of steps to perform on it.
         * The result of peforming all these steps will provide a "root hash", which can
         * be compared to the value in a header.
         * 
         * Since it is computationally infeasible to produce a hash collission for any of the used
         * cryptographic hash functions, if someone can provide a series of operations to transform
         * a given key and value into a root hash that matches some trusted root, these key and values
         * must be in the referenced merkle tree.
         * 
         * The only possible issue is maliablity in LeafOp, such as providing extra prefix data,
         * which should be controlled by a spec. Eg. with lengthOp as NONE,
         * prefix = FOO, key = BAR, value = CHOICE
         * and
         * prefix = F, key = OOBAR, value = CHOICE
         * would produce the same value.
         * 
         * With LengthOp this is tricker but not impossible. Which is why the "leafPrefixEqual" field
         * in the ProofSpec is valuable to prevent this mutability. And why all trees should
         * length-prefix the data before hashing it.
         * @implements IExistenceProof
         * @constructor
         * @param {proofs.IExistenceProof=} [properties] Properties to set
         */
        function ExistenceProof(properties) {
            this.steps = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExistenceProof key.
         * @member {Uint8Array} key
         * @memberof proofs.ExistenceProof
         * @instance
         */
        ExistenceProof.prototype.key = $util.newBuffer([]);

        /**
         * ExistenceProof value.
         * @member {Uint8Array} value
         * @memberof proofs.ExistenceProof
         * @instance
         */
        ExistenceProof.prototype.value = $util.newBuffer([]);

        /**
         * ExistenceProof steps.
         * @member {Array.<proofs.IProofOp>} steps
         * @memberof proofs.ExistenceProof
         * @instance
         */
        ExistenceProof.prototype.steps = $util.emptyArray;

        /**
         * Creates a new ExistenceProof instance using the specified properties.
         * @function create
         * @memberof proofs.ExistenceProof
         * @static
         * @param {proofs.IExistenceProof=} [properties] Properties to set
         * @returns {proofs.ExistenceProof} ExistenceProof instance
         */
        ExistenceProof.create = function create(properties) {
            return new ExistenceProof(properties);
        };

        /**
         * Encodes the specified ExistenceProof message. Does not implicitly {@link proofs.ExistenceProof.verify|verify} messages.
         * @function encode
         * @memberof proofs.ExistenceProof
         * @static
         * @param {proofs.IExistenceProof} message ExistenceProof message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExistenceProof.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && message.hasOwnProperty("key"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.key);
            if (message.value != null && message.hasOwnProperty("value"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
            if (message.steps != null && message.steps.length)
                for (var i = 0; i < message.steps.length; ++i)
                    $root.proofs.ProofOp.encode(message.steps[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ExistenceProof message, length delimited. Does not implicitly {@link proofs.ExistenceProof.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proofs.ExistenceProof
         * @static
         * @param {proofs.IExistenceProof} message ExistenceProof message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExistenceProof.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExistenceProof message from the specified reader or buffer.
         * @function decode
         * @memberof proofs.ExistenceProof
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proofs.ExistenceProof} ExistenceProof
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExistenceProof.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proofs.ExistenceProof();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = reader.bytes();
                    break;
                case 2:
                    message.value = reader.bytes();
                    break;
                case 3:
                    if (!(message.steps && message.steps.length))
                        message.steps = [];
                    message.steps.push($root.proofs.ProofOp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExistenceProof message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proofs.ExistenceProof
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proofs.ExistenceProof} ExistenceProof
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExistenceProof.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExistenceProof message.
         * @function verify
         * @memberof proofs.ExistenceProof
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExistenceProof.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!(message.key && typeof message.key.length === "number" || $util.isString(message.key)))
                    return "key: buffer expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                    return "value: buffer expected";
            if (message.steps != null && message.hasOwnProperty("steps")) {
                if (!Array.isArray(message.steps))
                    return "steps: array expected";
                for (var i = 0; i < message.steps.length; ++i) {
                    var error = $root.proofs.ProofOp.verify(message.steps[i]);
                    if (error)
                        return "steps." + error;
                }
            }
            return null;
        };

        /**
         * Creates an ExistenceProof message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proofs.ExistenceProof
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proofs.ExistenceProof} ExistenceProof
         */
        ExistenceProof.fromObject = function fromObject(object) {
            if (object instanceof $root.proofs.ExistenceProof)
                return object;
            var message = new $root.proofs.ExistenceProof();
            if (object.key != null)
                if (typeof object.key === "string")
                    $util.base64.decode(object.key, message.key = $util.newBuffer($util.base64.length(object.key)), 0);
                else if (object.key.length)
                    message.key = object.key;
            if (object.value != null)
                if (typeof object.value === "string")
                    $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                else if (object.value.length)
                    message.value = object.value;
            if (object.steps) {
                if (!Array.isArray(object.steps))
                    throw TypeError(".proofs.ExistenceProof.steps: array expected");
                message.steps = [];
                for (var i = 0; i < object.steps.length; ++i) {
                    if (typeof object.steps[i] !== "object")
                        throw TypeError(".proofs.ExistenceProof.steps: object expected");
                    message.steps[i] = $root.proofs.ProofOp.fromObject(object.steps[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an ExistenceProof message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proofs.ExistenceProof
         * @static
         * @param {proofs.ExistenceProof} message ExistenceProof
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExistenceProof.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.steps = [];
            if (options.defaults) {
                if (options.bytes === String)
                    object.key = "";
                else {
                    object.key = [];
                    if (options.bytes !== Array)
                        object.key = $util.newBuffer(object.key);
                }
                if (options.bytes === String)
                    object.value = "";
                else {
                    object.value = [];
                    if (options.bytes !== Array)
                        object.value = $util.newBuffer(object.value);
                }
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = options.bytes === String ? $util.base64.encode(message.key, 0, message.key.length) : options.bytes === Array ? Array.prototype.slice.call(message.key) : message.key;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
            if (message.steps && message.steps.length) {
                object.steps = [];
                for (var j = 0; j < message.steps.length; ++j)
                    object.steps[j] = $root.proofs.ProofOp.toObject(message.steps[j], options);
            }
            return object;
        };

        /**
         * Converts this ExistenceProof to JSON.
         * @function toJSON
         * @memberof proofs.ExistenceProof
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExistenceProof.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExistenceProof;
    })();

    proofs.ProofOp = (function() {

        /**
         * Properties of a ProofOp.
         * @memberof proofs
         * @interface IProofOp
         * @property {proofs.ILeafOp|null} [leaf] ProofOp leaf
         * @property {proofs.IInnerOp|null} [inner] ProofOp inner
         */

        /**
         * Constructs a new ProofOp.
         * @memberof proofs
         * @classdesc ProofOp is directions to peform one step of the merkle proof
         * @implements IProofOp
         * @constructor
         * @param {proofs.IProofOp=} [properties] Properties to set
         */
        function ProofOp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProofOp leaf.
         * @member {proofs.ILeafOp|null|undefined} leaf
         * @memberof proofs.ProofOp
         * @instance
         */
        ProofOp.prototype.leaf = null;

        /**
         * ProofOp inner.
         * @member {proofs.IInnerOp|null|undefined} inner
         * @memberof proofs.ProofOp
         * @instance
         */
        ProofOp.prototype.inner = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * ProofOp op.
         * @member {"leaf"|"inner"|undefined} op
         * @memberof proofs.ProofOp
         * @instance
         */
        Object.defineProperty(ProofOp.prototype, "op", {
            get: $util.oneOfGetter($oneOfFields = ["leaf", "inner"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ProofOp instance using the specified properties.
         * @function create
         * @memberof proofs.ProofOp
         * @static
         * @param {proofs.IProofOp=} [properties] Properties to set
         * @returns {proofs.ProofOp} ProofOp instance
         */
        ProofOp.create = function create(properties) {
            return new ProofOp(properties);
        };

        /**
         * Encodes the specified ProofOp message. Does not implicitly {@link proofs.ProofOp.verify|verify} messages.
         * @function encode
         * @memberof proofs.ProofOp
         * @static
         * @param {proofs.IProofOp} message ProofOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProofOp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.leaf != null && message.hasOwnProperty("leaf"))
                $root.proofs.LeafOp.encode(message.leaf, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.inner != null && message.hasOwnProperty("inner"))
                $root.proofs.InnerOp.encode(message.inner, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ProofOp message, length delimited. Does not implicitly {@link proofs.ProofOp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proofs.ProofOp
         * @static
         * @param {proofs.IProofOp} message ProofOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProofOp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProofOp message from the specified reader or buffer.
         * @function decode
         * @memberof proofs.ProofOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proofs.ProofOp} ProofOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProofOp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proofs.ProofOp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.leaf = $root.proofs.LeafOp.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.inner = $root.proofs.InnerOp.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProofOp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proofs.ProofOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proofs.ProofOp} ProofOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProofOp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProofOp message.
         * @function verify
         * @memberof proofs.ProofOp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProofOp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.leaf != null && message.hasOwnProperty("leaf")) {
                properties.op = 1;
                {
                    var error = $root.proofs.LeafOp.verify(message.leaf);
                    if (error)
                        return "leaf." + error;
                }
            }
            if (message.inner != null && message.hasOwnProperty("inner")) {
                if (properties.op === 1)
                    return "op: multiple values";
                properties.op = 1;
                {
                    var error = $root.proofs.InnerOp.verify(message.inner);
                    if (error)
                        return "inner." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ProofOp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proofs.ProofOp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proofs.ProofOp} ProofOp
         */
        ProofOp.fromObject = function fromObject(object) {
            if (object instanceof $root.proofs.ProofOp)
                return object;
            var message = new $root.proofs.ProofOp();
            if (object.leaf != null) {
                if (typeof object.leaf !== "object")
                    throw TypeError(".proofs.ProofOp.leaf: object expected");
                message.leaf = $root.proofs.LeafOp.fromObject(object.leaf);
            }
            if (object.inner != null) {
                if (typeof object.inner !== "object")
                    throw TypeError(".proofs.ProofOp.inner: object expected");
                message.inner = $root.proofs.InnerOp.fromObject(object.inner);
            }
            return message;
        };

        /**
         * Creates a plain object from a ProofOp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proofs.ProofOp
         * @static
         * @param {proofs.ProofOp} message ProofOp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProofOp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.leaf != null && message.hasOwnProperty("leaf")) {
                object.leaf = $root.proofs.LeafOp.toObject(message.leaf, options);
                if (options.oneofs)
                    object.op = "leaf";
            }
            if (message.inner != null && message.hasOwnProperty("inner")) {
                object.inner = $root.proofs.InnerOp.toObject(message.inner, options);
                if (options.oneofs)
                    object.op = "inner";
            }
            return object;
        };

        /**
         * Converts this ProofOp to JSON.
         * @function toJSON
         * @memberof proofs.ProofOp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProofOp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ProofOp;
    })();

    proofs.LeafOp = (function() {

        /**
         * Properties of a LeafOp.
         * @memberof proofs
         * @interface ILeafOp
         * @property {proofs.HashOp|null} [hash] LeafOp hash
         * @property {proofs.HashOp|null} [prehashKey] LeafOp prehashKey
         * @property {proofs.HashOp|null} [prehashValue] LeafOp prehashValue
         * @property {proofs.LengthOp|null} [length] LeafOp length
         * @property {Uint8Array|null} [prefix] LeafOp prefix
         */

        /**
         * Constructs a new LeafOp.
         * @memberof proofs
         * @classdesc LeafOp represents the raw key-value data we wish to prove, and
         * must be flexible to represent the internal transformation from
         * the original key-value pairs into the basis hash, for many existing
         * merkle trees.
         * 
         * key and value are passed in. So that the signature of this operation is:
         * leafOp(key, value) -> output
         * 
         * To process this, first prehash the keys and values if needed (ANY means no hash in this case):
         * hkey = prehashKey(key)
         * hvalue = prehashValue(value)
         * 
         * Then combine the bytes, and hash it
         * output = hash(prefix || length(hkey) || hkey || length(hvalue) || hvalue)
         * @implements ILeafOp
         * @constructor
         * @param {proofs.ILeafOp=} [properties] Properties to set
         */
        function LeafOp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LeafOp hash.
         * @member {proofs.HashOp} hash
         * @memberof proofs.LeafOp
         * @instance
         */
        LeafOp.prototype.hash = 0;

        /**
         * LeafOp prehashKey.
         * @member {proofs.HashOp} prehashKey
         * @memberof proofs.LeafOp
         * @instance
         */
        LeafOp.prototype.prehashKey = 0;

        /**
         * LeafOp prehashValue.
         * @member {proofs.HashOp} prehashValue
         * @memberof proofs.LeafOp
         * @instance
         */
        LeafOp.prototype.prehashValue = 0;

        /**
         * LeafOp length.
         * @member {proofs.LengthOp} length
         * @memberof proofs.LeafOp
         * @instance
         */
        LeafOp.prototype.length = 0;

        /**
         * LeafOp prefix.
         * @member {Uint8Array} prefix
         * @memberof proofs.LeafOp
         * @instance
         */
        LeafOp.prototype.prefix = $util.newBuffer([]);

        /**
         * Creates a new LeafOp instance using the specified properties.
         * @function create
         * @memberof proofs.LeafOp
         * @static
         * @param {proofs.ILeafOp=} [properties] Properties to set
         * @returns {proofs.LeafOp} LeafOp instance
         */
        LeafOp.create = function create(properties) {
            return new LeafOp(properties);
        };

        /**
         * Encodes the specified LeafOp message. Does not implicitly {@link proofs.LeafOp.verify|verify} messages.
         * @function encode
         * @memberof proofs.LeafOp
         * @static
         * @param {proofs.ILeafOp} message LeafOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LeafOp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hash != null && message.hasOwnProperty("hash"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.hash);
            if (message.prehashKey != null && message.hasOwnProperty("prehashKey"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.prehashKey);
            if (message.prehashValue != null && message.hasOwnProperty("prehashValue"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.prehashValue);
            if (message.length != null && message.hasOwnProperty("length"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.length);
            if (message.prefix != null && message.hasOwnProperty("prefix"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.prefix);
            return writer;
        };

        /**
         * Encodes the specified LeafOp message, length delimited. Does not implicitly {@link proofs.LeafOp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proofs.LeafOp
         * @static
         * @param {proofs.ILeafOp} message LeafOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LeafOp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LeafOp message from the specified reader or buffer.
         * @function decode
         * @memberof proofs.LeafOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proofs.LeafOp} LeafOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LeafOp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proofs.LeafOp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.hash = reader.int32();
                    break;
                case 2:
                    message.prehashKey = reader.int32();
                    break;
                case 3:
                    message.prehashValue = reader.int32();
                    break;
                case 4:
                    message.length = reader.int32();
                    break;
                case 5:
                    message.prefix = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LeafOp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proofs.LeafOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proofs.LeafOp} LeafOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LeafOp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LeafOp message.
         * @function verify
         * @memberof proofs.LeafOp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LeafOp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hash != null && message.hasOwnProperty("hash"))
                switch (message.hash) {
                default:
                    return "hash: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.prehashKey != null && message.hasOwnProperty("prehashKey"))
                switch (message.prehashKey) {
                default:
                    return "prehashKey: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.prehashValue != null && message.hasOwnProperty("prehashValue"))
                switch (message.prehashValue) {
                default:
                    return "prehashValue: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.length != null && message.hasOwnProperty("length"))
                switch (message.length) {
                default:
                    return "length: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    break;
                }
            if (message.prefix != null && message.hasOwnProperty("prefix"))
                if (!(message.prefix && typeof message.prefix.length === "number" || $util.isString(message.prefix)))
                    return "prefix: buffer expected";
            return null;
        };

        /**
         * Creates a LeafOp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proofs.LeafOp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proofs.LeafOp} LeafOp
         */
        LeafOp.fromObject = function fromObject(object) {
            if (object instanceof $root.proofs.LeafOp)
                return object;
            var message = new $root.proofs.LeafOp();
            switch (object.hash) {
            case "NO_HASH":
            case 0:
                message.hash = 0;
                break;
            case "SHA256":
            case 1:
                message.hash = 1;
                break;
            case "SHA512":
            case 2:
                message.hash = 2;
                break;
            case "KECCAK":
            case 3:
                message.hash = 3;
                break;
            }
            switch (object.prehashKey) {
            case "NO_HASH":
            case 0:
                message.prehashKey = 0;
                break;
            case "SHA256":
            case 1:
                message.prehashKey = 1;
                break;
            case "SHA512":
            case 2:
                message.prehashKey = 2;
                break;
            case "KECCAK":
            case 3:
                message.prehashKey = 3;
                break;
            }
            switch (object.prehashValue) {
            case "NO_HASH":
            case 0:
                message.prehashValue = 0;
                break;
            case "SHA256":
            case 1:
                message.prehashValue = 1;
                break;
            case "SHA512":
            case 2:
                message.prehashValue = 2;
                break;
            case "KECCAK":
            case 3:
                message.prehashValue = 3;
                break;
            }
            switch (object.length) {
            case "NO_PREFIX":
            case 0:
                message.length = 0;
                break;
            case "VAR_PROTO":
            case 1:
                message.length = 1;
                break;
            case "VAR_RLP":
            case 2:
                message.length = 2;
                break;
            case "FIXED32_BIG":
            case 3:
                message.length = 3;
                break;
            case "FIXED32_LITTLE":
            case 4:
                message.length = 4;
                break;
            case "FIXED64_BIG":
            case 5:
                message.length = 5;
                break;
            case "FIXED64_LITTLE":
            case 6:
                message.length = 6;
                break;
            case "REQUIRE_32_BYTES":
            case 7:
                message.length = 7;
                break;
            case "REQUIRE_64_BYTES":
            case 8:
                message.length = 8;
                break;
            }
            if (object.prefix != null)
                if (typeof object.prefix === "string")
                    $util.base64.decode(object.prefix, message.prefix = $util.newBuffer($util.base64.length(object.prefix)), 0);
                else if (object.prefix.length)
                    message.prefix = object.prefix;
            return message;
        };

        /**
         * Creates a plain object from a LeafOp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proofs.LeafOp
         * @static
         * @param {proofs.LeafOp} message LeafOp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LeafOp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.hash = options.enums === String ? "NO_HASH" : 0;
                object.prehashKey = options.enums === String ? "NO_HASH" : 0;
                object.prehashValue = options.enums === String ? "NO_HASH" : 0;
                object.length = options.enums === String ? "NO_PREFIX" : 0;
                if (options.bytes === String)
                    object.prefix = "";
                else {
                    object.prefix = [];
                    if (options.bytes !== Array)
                        object.prefix = $util.newBuffer(object.prefix);
                }
            }
            if (message.hash != null && message.hasOwnProperty("hash"))
                object.hash = options.enums === String ? $root.proofs.HashOp[message.hash] : message.hash;
            if (message.prehashKey != null && message.hasOwnProperty("prehashKey"))
                object.prehashKey = options.enums === String ? $root.proofs.HashOp[message.prehashKey] : message.prehashKey;
            if (message.prehashValue != null && message.hasOwnProperty("prehashValue"))
                object.prehashValue = options.enums === String ? $root.proofs.HashOp[message.prehashValue] : message.prehashValue;
            if (message.length != null && message.hasOwnProperty("length"))
                object.length = options.enums === String ? $root.proofs.LengthOp[message.length] : message.length;
            if (message.prefix != null && message.hasOwnProperty("prefix"))
                object.prefix = options.bytes === String ? $util.base64.encode(message.prefix, 0, message.prefix.length) : options.bytes === Array ? Array.prototype.slice.call(message.prefix) : message.prefix;
            return object;
        };

        /**
         * Converts this LeafOp to JSON.
         * @function toJSON
         * @memberof proofs.LeafOp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LeafOp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LeafOp;
    })();

    proofs.InnerOp = (function() {

        /**
         * Properties of an InnerOp.
         * @memberof proofs
         * @interface IInnerOp
         * @property {proofs.HashOp|null} [hash] InnerOp hash
         * @property {Uint8Array|null} [prefix] InnerOp prefix
         * @property {Uint8Array|null} [suffix] InnerOp suffix
         */

        /**
         * Constructs a new InnerOp.
         * @memberof proofs
         * @classdesc InnerOp represents a merkle-proof step that is not a leaf.
         * It represents concatenating two children and hashing them to provide the next result.
         * 
         * The result of the previous step is passed in, so the signature of this op is:
         * innerOp(child) -> output
         * 
         * The result of applying InnerOp should be:
         * output = op.hash(op.prefix || child || op.suffix)
         * 
         * where the || operator is concatenation of binary data,
         * and child is the result of hashing all the tree below this step.
         * 
         * Any special data, like prepending child with the length, or prepending the entire operation with
         * some value to differentiate from leaf nodes, should be included in prefix and suffix.
         * If either of prefix or suffix is empty, we just treat it as an empty string
         * @implements IInnerOp
         * @constructor
         * @param {proofs.IInnerOp=} [properties] Properties to set
         */
        function InnerOp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InnerOp hash.
         * @member {proofs.HashOp} hash
         * @memberof proofs.InnerOp
         * @instance
         */
        InnerOp.prototype.hash = 0;

        /**
         * InnerOp prefix.
         * @member {Uint8Array} prefix
         * @memberof proofs.InnerOp
         * @instance
         */
        InnerOp.prototype.prefix = $util.newBuffer([]);

        /**
         * InnerOp suffix.
         * @member {Uint8Array} suffix
         * @memberof proofs.InnerOp
         * @instance
         */
        InnerOp.prototype.suffix = $util.newBuffer([]);

        /**
         * Creates a new InnerOp instance using the specified properties.
         * @function create
         * @memberof proofs.InnerOp
         * @static
         * @param {proofs.IInnerOp=} [properties] Properties to set
         * @returns {proofs.InnerOp} InnerOp instance
         */
        InnerOp.create = function create(properties) {
            return new InnerOp(properties);
        };

        /**
         * Encodes the specified InnerOp message. Does not implicitly {@link proofs.InnerOp.verify|verify} messages.
         * @function encode
         * @memberof proofs.InnerOp
         * @static
         * @param {proofs.IInnerOp} message InnerOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InnerOp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hash != null && message.hasOwnProperty("hash"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.hash);
            if (message.prefix != null && message.hasOwnProperty("prefix"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.prefix);
            if (message.suffix != null && message.hasOwnProperty("suffix"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.suffix);
            return writer;
        };

        /**
         * Encodes the specified InnerOp message, length delimited. Does not implicitly {@link proofs.InnerOp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proofs.InnerOp
         * @static
         * @param {proofs.IInnerOp} message InnerOp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InnerOp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InnerOp message from the specified reader or buffer.
         * @function decode
         * @memberof proofs.InnerOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proofs.InnerOp} InnerOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InnerOp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proofs.InnerOp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.hash = reader.int32();
                    break;
                case 2:
                    message.prefix = reader.bytes();
                    break;
                case 3:
                    message.suffix = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InnerOp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proofs.InnerOp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proofs.InnerOp} InnerOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InnerOp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InnerOp message.
         * @function verify
         * @memberof proofs.InnerOp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InnerOp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hash != null && message.hasOwnProperty("hash"))
                switch (message.hash) {
                default:
                    return "hash: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.prefix != null && message.hasOwnProperty("prefix"))
                if (!(message.prefix && typeof message.prefix.length === "number" || $util.isString(message.prefix)))
                    return "prefix: buffer expected";
            if (message.suffix != null && message.hasOwnProperty("suffix"))
                if (!(message.suffix && typeof message.suffix.length === "number" || $util.isString(message.suffix)))
                    return "suffix: buffer expected";
            return null;
        };

        /**
         * Creates an InnerOp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proofs.InnerOp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proofs.InnerOp} InnerOp
         */
        InnerOp.fromObject = function fromObject(object) {
            if (object instanceof $root.proofs.InnerOp)
                return object;
            var message = new $root.proofs.InnerOp();
            switch (object.hash) {
            case "NO_HASH":
            case 0:
                message.hash = 0;
                break;
            case "SHA256":
            case 1:
                message.hash = 1;
                break;
            case "SHA512":
            case 2:
                message.hash = 2;
                break;
            case "KECCAK":
            case 3:
                message.hash = 3;
                break;
            }
            if (object.prefix != null)
                if (typeof object.prefix === "string")
                    $util.base64.decode(object.prefix, message.prefix = $util.newBuffer($util.base64.length(object.prefix)), 0);
                else if (object.prefix.length)
                    message.prefix = object.prefix;
            if (object.suffix != null)
                if (typeof object.suffix === "string")
                    $util.base64.decode(object.suffix, message.suffix = $util.newBuffer($util.base64.length(object.suffix)), 0);
                else if (object.suffix.length)
                    message.suffix = object.suffix;
            return message;
        };

        /**
         * Creates a plain object from an InnerOp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proofs.InnerOp
         * @static
         * @param {proofs.InnerOp} message InnerOp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InnerOp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.hash = options.enums === String ? "NO_HASH" : 0;
                if (options.bytes === String)
                    object.prefix = "";
                else {
                    object.prefix = [];
                    if (options.bytes !== Array)
                        object.prefix = $util.newBuffer(object.prefix);
                }
                if (options.bytes === String)
                    object.suffix = "";
                else {
                    object.suffix = [];
                    if (options.bytes !== Array)
                        object.suffix = $util.newBuffer(object.suffix);
                }
            }
            if (message.hash != null && message.hasOwnProperty("hash"))
                object.hash = options.enums === String ? $root.proofs.HashOp[message.hash] : message.hash;
            if (message.prefix != null && message.hasOwnProperty("prefix"))
                object.prefix = options.bytes === String ? $util.base64.encode(message.prefix, 0, message.prefix.length) : options.bytes === Array ? Array.prototype.slice.call(message.prefix) : message.prefix;
            if (message.suffix != null && message.hasOwnProperty("suffix"))
                object.suffix = options.bytes === String ? $util.base64.encode(message.suffix, 0, message.suffix.length) : options.bytes === Array ? Array.prototype.slice.call(message.suffix) : message.suffix;
            return object;
        };

        /**
         * Converts this InnerOp to JSON.
         * @function toJSON
         * @memberof proofs.InnerOp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InnerOp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InnerOp;
    })();

    proofs.ProofSpec = (function() {

        /**
         * Properties of a ProofSpec.
         * @memberof proofs
         * @interface IProofSpec
         * @property {proofs.HashOp|null} [leafHash] ProofSpec leafHash
         * @property {proofs.HashOp|null} [innerHash] ProofSpec innerHash
         * @property {Uint8Array|null} [leafPrefixEqual] ProofSpec leafPrefixEqual
         * @property {Uint8Array|null} [innerPrefixStartsWith] ProofSpec innerPrefixStartsWith
         */

        /**
         * Constructs a new ProofSpec.
         * @memberof proofs
         * @classdesc ProofSpec defines what the expected parameters are for a given proof type.
         * This can be stored in the client and used to validate any incoming proofs.
         * 
         * verify(ProofSpec, Proof) -> Proof | Error
         * 
         * -> Must specify the LeafOp for a given tree type... all LeafOps must use this format!
         * @implements IProofSpec
         * @constructor
         * @param {proofs.IProofSpec=} [properties] Properties to set
         */
        function ProofSpec(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProofSpec leafHash.
         * @member {proofs.HashOp} leafHash
         * @memberof proofs.ProofSpec
         * @instance
         */
        ProofSpec.prototype.leafHash = 0;

        /**
         * ProofSpec innerHash.
         * @member {proofs.HashOp} innerHash
         * @memberof proofs.ProofSpec
         * @instance
         */
        ProofSpec.prototype.innerHash = 0;

        /**
         * ProofSpec leafPrefixEqual.
         * @member {Uint8Array} leafPrefixEqual
         * @memberof proofs.ProofSpec
         * @instance
         */
        ProofSpec.prototype.leafPrefixEqual = $util.newBuffer([]);

        /**
         * ProofSpec innerPrefixStartsWith.
         * @member {Uint8Array} innerPrefixStartsWith
         * @memberof proofs.ProofSpec
         * @instance
         */
        ProofSpec.prototype.innerPrefixStartsWith = $util.newBuffer([]);

        /**
         * Creates a new ProofSpec instance using the specified properties.
         * @function create
         * @memberof proofs.ProofSpec
         * @static
         * @param {proofs.IProofSpec=} [properties] Properties to set
         * @returns {proofs.ProofSpec} ProofSpec instance
         */
        ProofSpec.create = function create(properties) {
            return new ProofSpec(properties);
        };

        /**
         * Encodes the specified ProofSpec message. Does not implicitly {@link proofs.ProofSpec.verify|verify} messages.
         * @function encode
         * @memberof proofs.ProofSpec
         * @static
         * @param {proofs.IProofSpec} message ProofSpec message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProofSpec.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.leafHash != null && message.hasOwnProperty("leafHash"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.leafHash);
            if (message.innerHash != null && message.hasOwnProperty("innerHash"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.innerHash);
            if (message.leafPrefixEqual != null && message.hasOwnProperty("leafPrefixEqual"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.leafPrefixEqual);
            if (message.innerPrefixStartsWith != null && message.hasOwnProperty("innerPrefixStartsWith"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.innerPrefixStartsWith);
            return writer;
        };

        /**
         * Encodes the specified ProofSpec message, length delimited. Does not implicitly {@link proofs.ProofSpec.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proofs.ProofSpec
         * @static
         * @param {proofs.IProofSpec} message ProofSpec message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProofSpec.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProofSpec message from the specified reader or buffer.
         * @function decode
         * @memberof proofs.ProofSpec
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proofs.ProofSpec} ProofSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProofSpec.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proofs.ProofSpec();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.leafHash = reader.int32();
                    break;
                case 2:
                    message.innerHash = reader.int32();
                    break;
                case 3:
                    message.leafPrefixEqual = reader.bytes();
                    break;
                case 4:
                    message.innerPrefixStartsWith = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProofSpec message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proofs.ProofSpec
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proofs.ProofSpec} ProofSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProofSpec.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProofSpec message.
         * @function verify
         * @memberof proofs.ProofSpec
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProofSpec.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.leafHash != null && message.hasOwnProperty("leafHash"))
                switch (message.leafHash) {
                default:
                    return "leafHash: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.innerHash != null && message.hasOwnProperty("innerHash"))
                switch (message.innerHash) {
                default:
                    return "innerHash: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.leafPrefixEqual != null && message.hasOwnProperty("leafPrefixEqual"))
                if (!(message.leafPrefixEqual && typeof message.leafPrefixEqual.length === "number" || $util.isString(message.leafPrefixEqual)))
                    return "leafPrefixEqual: buffer expected";
            if (message.innerPrefixStartsWith != null && message.hasOwnProperty("innerPrefixStartsWith"))
                if (!(message.innerPrefixStartsWith && typeof message.innerPrefixStartsWith.length === "number" || $util.isString(message.innerPrefixStartsWith)))
                    return "innerPrefixStartsWith: buffer expected";
            return null;
        };

        /**
         * Creates a ProofSpec message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proofs.ProofSpec
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proofs.ProofSpec} ProofSpec
         */
        ProofSpec.fromObject = function fromObject(object) {
            if (object instanceof $root.proofs.ProofSpec)
                return object;
            var message = new $root.proofs.ProofSpec();
            switch (object.leafHash) {
            case "NO_HASH":
            case 0:
                message.leafHash = 0;
                break;
            case "SHA256":
            case 1:
                message.leafHash = 1;
                break;
            case "SHA512":
            case 2:
                message.leafHash = 2;
                break;
            case "KECCAK":
            case 3:
                message.leafHash = 3;
                break;
            }
            switch (object.innerHash) {
            case "NO_HASH":
            case 0:
                message.innerHash = 0;
                break;
            case "SHA256":
            case 1:
                message.innerHash = 1;
                break;
            case "SHA512":
            case 2:
                message.innerHash = 2;
                break;
            case "KECCAK":
            case 3:
                message.innerHash = 3;
                break;
            }
            if (object.leafPrefixEqual != null)
                if (typeof object.leafPrefixEqual === "string")
                    $util.base64.decode(object.leafPrefixEqual, message.leafPrefixEqual = $util.newBuffer($util.base64.length(object.leafPrefixEqual)), 0);
                else if (object.leafPrefixEqual.length)
                    message.leafPrefixEqual = object.leafPrefixEqual;
            if (object.innerPrefixStartsWith != null)
                if (typeof object.innerPrefixStartsWith === "string")
                    $util.base64.decode(object.innerPrefixStartsWith, message.innerPrefixStartsWith = $util.newBuffer($util.base64.length(object.innerPrefixStartsWith)), 0);
                else if (object.innerPrefixStartsWith.length)
                    message.innerPrefixStartsWith = object.innerPrefixStartsWith;
            return message;
        };

        /**
         * Creates a plain object from a ProofSpec message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proofs.ProofSpec
         * @static
         * @param {proofs.ProofSpec} message ProofSpec
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProofSpec.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.leafHash = options.enums === String ? "NO_HASH" : 0;
                object.innerHash = options.enums === String ? "NO_HASH" : 0;
                if (options.bytes === String)
                    object.leafPrefixEqual = "";
                else {
                    object.leafPrefixEqual = [];
                    if (options.bytes !== Array)
                        object.leafPrefixEqual = $util.newBuffer(object.leafPrefixEqual);
                }
                if (options.bytes === String)
                    object.innerPrefixStartsWith = "";
                else {
                    object.innerPrefixStartsWith = [];
                    if (options.bytes !== Array)
                        object.innerPrefixStartsWith = $util.newBuffer(object.innerPrefixStartsWith);
                }
            }
            if (message.leafHash != null && message.hasOwnProperty("leafHash"))
                object.leafHash = options.enums === String ? $root.proofs.HashOp[message.leafHash] : message.leafHash;
            if (message.innerHash != null && message.hasOwnProperty("innerHash"))
                object.innerHash = options.enums === String ? $root.proofs.HashOp[message.innerHash] : message.innerHash;
            if (message.leafPrefixEqual != null && message.hasOwnProperty("leafPrefixEqual"))
                object.leafPrefixEqual = options.bytes === String ? $util.base64.encode(message.leafPrefixEqual, 0, message.leafPrefixEqual.length) : options.bytes === Array ? Array.prototype.slice.call(message.leafPrefixEqual) : message.leafPrefixEqual;
            if (message.innerPrefixStartsWith != null && message.hasOwnProperty("innerPrefixStartsWith"))
                object.innerPrefixStartsWith = options.bytes === String ? $util.base64.encode(message.innerPrefixStartsWith, 0, message.innerPrefixStartsWith.length) : options.bytes === Array ? Array.prototype.slice.call(message.innerPrefixStartsWith) : message.innerPrefixStartsWith;
            return object;
        };

        /**
         * Converts this ProofSpec to JSON.
         * @function toJSON
         * @memberof proofs.ProofSpec
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProofSpec.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ProofSpec;
    })();

    return proofs;
})();

module.exports = $root;
