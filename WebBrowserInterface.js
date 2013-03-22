
    var WebBrowserInterface = {
        imageFrameCount: 4,
        bifImageCount: 0,
        bifFrameIndex: 0,
        bifBinary: null,

        reset: function() {
            this.bifImageCount = 0;
            this.bifFrameIndex = 0;
            this.bifBinary = null;
        },

        uploadBifBlob: function(files) {
            // reset the indices
            this.reset();

            if (!files) {
                alert('Files not found!');
                return;
            }

            if (!files.length) {
                alert('Please select a bif file!');
                return;
            }

            var file = files[0];
            var reader = new FileReader();

            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    document.getElementById('bytes').textContent = ' bytes = ' + file.size;

                    var bufferResult = evt.target.result;
                    WebBrowserInterface.bifBinary = bufferResult;

                    // console.log("WebBrowserInterface.bifBinary = " + WebBrowserInterface.bifBinary);

                    if (!BifParser.hasValidHeader(bufferResult)) {
                        alert('Invalid bif file.');
                        return;
                    }

                    WebBrowserInterface.printBifFileSpecifics(bufferResult);

                    WebBrowserInterface.bifImageCount = BifParser.getImageCount(bufferResult);

                    var frames = BifParser.getSequenceOfFrames(bufferResult, 0, WebBrowserInterface.imageFrameCount);
                    WebBrowserInterface.placeFrames(frames);
                }
            };

            reader.onerror = function(evt) {
                // console.log("error reading: code " + evt.target.error.code);

                switch(evt.target.error.code) {
                    case evt.target.error.NOT_FOUND_ERR:
                        alert('evt.target.error.NOT_FOUND_ERR');
                        break;
                    case evt.target.error.NOT_READABLE_ERR:
                        alert('evt.target.error.NOT_READABLE_ERRR');
                        break;
                    case evt.target.error.ENCODING_ERR:
                        alert('evt.target.error.ENCODING_ERR');
                        break;
                    case evt.target.error.SECURITY_ERR:
                        alert('evt.target.error.SECURITY_ERR');
                        break;
                    case evt.target.error.ABORT_ERR:
                        break;
                    default:
                        alert('An error occurred reading this file.');
                }
            };

            reader.readAsBinaryString(file);
        },

        printBifFileSpecifics: function(b) {
            var value = BifParser.getMagicIdentifier(b);
            document.getElementById("magicIdentifier").innerHTML = "magicIdentifier = " + value;
            
            value = BifParser.getVersion(b);
            document.getElementById("version").innerHTML = "version = " + value;

            value = BifParser.getImageCount(b);
            document.getElementById("imageCount").innerHTML = "imageCount = " + value;

            value = BifParser.getTimestampMultipler(b);
            document.getElementById("timestampMultipler").innerHTML = "timestampMultipler = " + value;
        },

        pushFrame: function(index) {
            // console.log("this.bifFrameIndex = " + this.bifFrameIndex + " this.bifImageCount = " + this.bifImageCount);
            // console.log("this.bifBinary (memory) = " + this.bifBinary.length);

            // backward protection
            if (this.bifFrameIndex + index < 0) {
                return;
            }

            // forward protection
            if (index != -1 && (this.bifFrameIndex >= (this.bifImageCount - this.imageFrameCount))) {
                return;
            }

            this.bifFrameIndex += index;

            var frames = BifParser.getSequenceOfFrames(this.bifBinary, this.bifFrameIndex, this.imageFrameCount);
            this.placeFrames(frames);
        },

        placeFrames: function(frames) {
            if (frames.length < 1) {
                return;
            }

            for (var i = 1; i < frames.length; i++) {
                document.getElementById("image" + i).setAttribute("src", frames[i]);
            }
        },

        findFrame: function(index) {
            if (index < 1) {
                alert("Minimum frame index is 1");
                return;
            }

            if (index > this.bifImageCount) {
                alert("Maximum frame index is " + this.bifImageCount);
                return;
            }

            var finalBase64Encode = BifParser.getFrame(this.bifBinary, parseInt(index - 1, 10));

            document.getElementById("foundimage").setAttribute("src", finalBase64Encode);
        },

        initInterface: function() {
            document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
                if (evt.target.tagName.toLowerCase() == 'button') {
                    var files = document.getElementById('files').files;
                    WebBrowserInterface.uploadBifBlob(files);
                }
            }, false);

            document.querySelector('.updateIndexButtons').addEventListener('click', function(evt) {
                if (evt.target.tagName.toLowerCase() == 'button') {
                   var index = document.getElementById('imageindex').value;
                   WebBrowserInterface.findFrame(index);
                }
            }, false);
        }
    };
