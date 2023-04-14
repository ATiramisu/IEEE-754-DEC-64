function convert() {

}

function convertandsave() {
    saveToFile(result, "IEEE-754.txt");
}

function decimalToBinary(decimal, rounding) {
  
}
    
        function binaryToHexadecimal(binary) {

        }
    
        function decToBin(decimal, length) {

        }
    
        function binToDec(binary) {
            return parseInt(binary, 2);
        }
    
        function decToHex(decimal) {
            return decimal.toString(16).toUpperCase();
        }
    
		function saveToFile(data, filename) {
			// Create blob with binary data
			let blob = new Blob([data], {type: "application/octet-stream"});

			// Create URL for blob
			let url = URL.createObjectURL(blob);

			// Create link element for download
			let link = document.createElement("a");
			link.href = url;
			link.download = filename || "IEEE-754.txt";

			// Click link to start download
			link.click();

			// Clean up
			URL.revokeObjectURL(url);
		}