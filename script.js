function convert() {
    // Get input values
    let decimal = document.getElementById("decimal").value;
    let rounding = document.getElementById("rounding").value;
    let output = document.getElementById("output").value;

    // Convert decimal to binary
    decimal = decimal.replace(/x/i, '*');  // Replace "x" with "*"
    decimal = decimal.replace(/\^/i, '**'); // Replace "^" with "**"
    decimal = eval(decimal);  // Evaluate the expression
    let binary = decimalToBinary(decimal, rounding);

    // Convert binary to hexadecimal
    let hexadecimal = binaryToHexadecimal(binary);

    // Output the result
    let result = "";
    if (output === "binary") {
        result = binary;
    } else if (output === "hexadecimal") {
        result = hexadecimal;
    }

    // Display result
    document.getElementById("result").value = result;
}

function convertandsave() {
    // Get input values
    let decimal = document.getElementById("decimal").value;
    let rounding = document.getElementById("rounding").value;
    let output = document.getElementById("output").value;

    // Convert decimal to binary
    decimal = decimal.replace(/x/i, '*');  // Replace "x" with "*"
    decimal = decimal.replace(/\^/i, '**'); // Replace "^" with "**"
    decimal = eval(decimal);  // Evaluate the expression
    let binary = decimalToBinary(decimal, rounding);

    // Convert binary to hexadecimal
    let hexadecimal = binaryToHexadecimal(binary);

    // Output the result
    let result = "";
    if (output === "binary") {
        result = binary;
    } else if (output === "hexadecimal") {
        result = hexadecimal;
    }

    // Display result
    document.getElementById("result").value = result;

    saveToFile(result, "IEEE-754.txt");

}

function decimalToBinary(decimal, rounding) {
    if (isNaN(decimal)) {
        return "NaN";
    }
    
    let sign = "+";
    if (decimal < 0) {
        sign = "-";
        decimal = -decimal;
    }

    let exponent = Math.floor(Math.log2(decimal));
    let mantissa = decimal / Math.pow(2, exponent) - 1;

    if (exponent === -Infinity) {
        // Negative infinity denormalized
        exponent = 0;
        mantissa = 0.5;
        sign = "-";
    } else if (exponent < -1022) {
        // Subnormal
        exponent = 0;
        mantissa *= Math.pow(2, 1022);
    } else if (exponent >= 1024) {
        // Infinity
        exponent = 2047;
        mantissa = 0;
    } else {
        // Normal
        exponent += 1023;
        mantissa = mantissa * Math.pow(2, 52);
    }

    // Round the mantissa
    if (mantissa < 0) {
        mantissa = -mantissa;
    }
    if (mantissa >= 1) {
        if (rounding === "up") {
            mantissa = 1;
        } else if (rounding === "down") {
            mantissa = 0;
        } else if (rounding === "zero") {
            mantissa = 0;
        } else {
            let diff1 = mantissa - Math.floor(mantissa);
            let diff2 = Math.ceil(mantissa) - mantissa;
            if (diff1 < diff2) {
                mantissa = Math.floor(mantissa * 2) / 2;
            } else if (diff1 > diff2) {
                mantissa = Math.ceil(mantissa * 2) / 2;
            } else {
                if (Math.floor(mantissa * 2) % 2 === 0) {
                    mantissa = Math.floor(mantissa * 2) / 2;
                } else {
                    mantissa = Math.ceil(mantissa * 2) / 2;
                }
            }
        }
    }

    // Convert sign, exponent, and mantissa to binary
    let binarySign = (sign === "+") ? "0" : "1";
    let binaryExponent = decToBin(exponent, 11);
    let binaryMantissa = mantissa.toString(2).padStart(64, "0").slice(12, 64);
    
    if (exponent === -1023 && mantissa === 0) {
        // Negative infinity
        binarySign = "1";
        binaryExponent = "0".repeat(11);
        binaryMantissa = "0".repeat(51) + "1";
    }

    // Combine sign, exponent, and mantissa to form binary
    let binary = binarySign + binaryExponent + binaryMantissa;

    // Add spaces between sections of binary for readability
    binary = binary.replace(/(.{1})(.{11})(.{52})/, "$1 $2 $3");

    return binary;
}

function decToBin(decimal, digits) {
    let binary = "";
    for (let i = digits - 1; i >= 0; i--) {
        let power = Math.pow(2, i);
        if (decimal >= power) {
            binary += "1";
            decimal -= power;
        } else {
            binary += "0";
        }
    }
    return binary;
}
    
        function binaryToHexadecimal(binary) {
            // Split binary into four-bit chunks
            let chunks = binary.split(/\s+/).join("").match(/.{1,4}/g);
    
            // Convert each chunk to hexadecimal
            let hexadecimal = "";
            for (let i = 0; i < chunks.length; i++) {
                let chunk = chunks[i];
                let decimal = binToDec(chunk);
                let hex = decToHex(decimal);
                hexadecimal += hex;
            }
    
            return hexadecimal;
        }
    
        function decToBin(decimal, length) {
            let binary = decimal.toString(2);
            while (binary.length < length) {
                binary = "0" + binary;
            }
            return binary;
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
