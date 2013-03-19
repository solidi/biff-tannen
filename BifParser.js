
    var BifParser = {
        headerByteSize: 64,

        validateBifMagicString: function(b) {
            var magicIdentifier = this.getMagicIdentifier(b);

            // 9 byte value
            if (magicIdentifier != 1179206281) {
                return false;
            }

            return true;
        },

        getHeaderValue: function(b) {
            var rawBytes = Array();

            for (var i = 0; i < b.length; i++) {
                rawBytes.push(b[i].charCodeAt(0) & 0xff);
            }

            var value = ByteUtilites.shift32Bits(rawBytes, 0);

            return value;
        },

        hasHeader: function(b) {
            if (!b || b.length < this.headerByteSize) {
                return false;
            }

            return true;
        },

        hasImages: function(b) {
            if (this.getImageCount(b) <= 0) {
                return false;
            }

            return true;
        },

        getMagicIdentifier: function(b) {
            return this.getHeaderValue(b.slice(0, 9));
        },

        getVersion: function(b) {
            return this.getHeaderValue(b.slice(8, 12));
        },

        getImageCount: function(b) {
            return this.getHeaderValue(b.slice(12, 16));
        },

        getTimestampMultipler: function(b) {
            return this.getHeaderValue(b.slice(16, 20));
        },

        hasValidHeader: function(b) {
            if (!this.hasHeader(b)) {
                return false;
            }

            if (!this.validateBifMagicString(b)) {
                return false;
            }

            if (this.getVersion(b) != this.acceptsVersion()) {
                return false;
            }

            if (!this.hasImages(b)) {
                return false;
            }

            if (this.getTimestampMultipler(b) < 1) {
                return false;
            }

            return true;
        },

        acceptsVersion: function() {
            return 0;
        },

        getFrameInfo: function(b, index) {
            var bifIndexSearchAtPosition = this.headerByteSize + (8 * index);

            // console.log("---- var bifIndexSearchAtPosition = ", bifIndexSearchAtPosition);

            var indexBytes = [b[bifIndexSearchAtPosition].charCodeAt(0) & 0xff, 
                              b[bifIndexSearchAtPosition + 1].charCodeAt(0) & 0xff,
                              b[bifIndexSearchAtPosition + 2].charCodeAt(0) & 0xff, 
                              b[bifIndexSearchAtPosition + 3].charCodeAt(0) & 0xff];

            var frameIndex = ByteUtilites.shift32Bits(indexBytes, 0);

            // console.log("---- var frameIndex = ", frameIndex);

            bifIndexSearchAtPosition += 4;

            var frameOffsetBytes = [b[bifIndexSearchAtPosition].charCodeAt(0) & 0xff, 
                                    b[bifIndexSearchAtPosition + 1].charCodeAt(0) & 0xff,
                                    b[bifIndexSearchAtPosition + 2].charCodeAt(0) & 0xff, 
                                    b[bifIndexSearchAtPosition + 3].charCodeAt(0) & 0xff];

            frameOffset = ByteUtilites.shift32Bits(frameOffsetBytes, 0);

            // console.log("---- var frameOffset = ", frameOffset);

            return [frameIndex, frameOffset];
        },

        encodeImage: function(buffer) {
            var forwardPNGEncodeString = "data:image/png;base64,";
            var forwardJPEGEncodeString = "data:image/jpeg;base64,";

            // console.log("---- var buffer[] = ", buffer);

            var base64Buffer = ByteUtilites.Base64.encode(buffer);

            // console.log("---- var base64Buffer = ", base64Buffer);

            // dump to the window
            finalBase64Encode = forwardJPEGEncodeString + base64Buffer;

            if (buffer.slice(1, 4) == "PNG") {
                finalBase64Encode = forwardPNGEncodeString + base64Buffer;
            }

            // console.log("finalBase64Encode = ", finalBase64Encode);

            return finalBase64Encode;
        },

        getFrame: function(b, index) {
            var j = 0;
            var buffer = "";

            frameByteIndex = this.getFrameInfo(b, index)[1];
            nextFrameByteIndex = this.getFrameInfo(b, index + 1)[1];

            for (var i = frameByteIndex; i <= nextFrameByteIndex - 1; i++) {
                buffer += b[i];
                j++;
            }

            return this.encodeImage(buffer);
        },

        getSequenceOfFrames: function(b, startAtIndex, maxImageCount) {
            var processImageCount = 0;
            var frameOffset = 0;
            var previousFrameOffset = 0;
            var setOfFrames = [];
            var offsetMessageInfo = "";

            while (processImageCount <= maxImageCount) {
                var frameInfo = this.getFrameInfo(b, startAtIndex);
                var frameIndex = frameInfo[0];
                var frameOffset = frameInfo[1];

                offsetMessageInfo += "<br />" + " index: " + frameIndex + " fos bytes: " + frameOffset;

                if (processImageCount > 0) {
                    var j = 0;
                    var buffer = "";

                    for (var i = previousFrameOffset; i <= frameOffset - 1; i++) {
                        buffer += b[i];
                        j++;
                    }

                    setOfFrames[processImageCount] = this.encodeImage(buffer);
                }

                previousFrameOffset = frameOffset;

                // console.log("---- var previousFrameOffset = ", previousFrameOffset);

                startAtIndex += 1;
                processImageCount += 1;
            }

            // A detached event debug logger is best. In addition, this can handle all console.log()'s as well.
            // Leave the abstraction for a seperate task.
            document.getElementById("offsetMessageInfo").innerHTML = "[offsetMessageInfo]" + offsetMessageInfo;

            return setOfFrames;
        }
    }
