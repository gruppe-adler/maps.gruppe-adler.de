package utils

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

// ReadJSON Reads JSON from given path and unmarshals that inti given pointer
func ReadJSON(path string, pointer interface{}) error {
	// Open our file
	file, err := os.Open(path)
	// if we os.Open returns an error then handle it
	if err != nil {
		return err
	}

	// read our opened file as a byte array.
	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}

	// close the file
	err = file.Close()
	if err != nil {
		return err
	}

	// we unmarshal our byteArray which contains our
	// file's content into 'pointer'
	json.Unmarshal(byteValue, pointer)
	if err != nil {
		return err
	}

	return nil
}
