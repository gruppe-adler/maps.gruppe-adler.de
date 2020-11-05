package utils

import "os"

// Check error
func Check(errToCheck error, description string) {
	if errToCheck == nil {
		return
	}

	if description != "" {
		os.Stderr.WriteString(description)
		os.Stderr.WriteString("\n")
	}
	os.Stderr.WriteString(errToCheck.Error())
	os.Stderr.WriteString("\n")
	os.Exit(1)
}
