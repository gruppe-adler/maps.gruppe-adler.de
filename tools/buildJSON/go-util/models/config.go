package models

// ConfigJSON describes the format of a config.json
type ConfigJSON struct {
	URIs         []string `json:"uris"`
	Attribution  string   `json:"attribution"`
	SourcePrefix string   `json:"source-prefix"`
}
