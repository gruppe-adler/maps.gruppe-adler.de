package utils

import (
	"encoding/json"
	"os"
)

// PrintJSON Encodes given interface as JSON and prints it to stdout
func PrintJSON(pointer interface{}) {
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetEscapeHTML(false)

	err := encoder.Encode(pointer)
	Check(err, "Error while encoding JSON:")
}
