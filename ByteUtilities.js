
    var ByteUtilites = {
        shift32Bits: function(arr, offs) {
            // console.log("--- shift32Bits in: ", arr);

            // little endianness, shift 4 bytes in reverse
            var out = (arr[offs + 3] << 24) + (arr[offs + 2] << 16) + (arr[offs + 1] << 8) + arr[offs + 0];

            // console.log("--- shift32Bits out: ", out);

            return out;
        },

        Base64 : {
            _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            encode : function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                while (i < input.length) {
                    chr1 = input.charCodeAt(i++) & 0xff;
                    chr2 = input.charCodeAt(i++) & 0xff;
                    chr3 = input.charCodeAt(i++) & 0xff;

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
                }

                return output;
            }

        }
    };
