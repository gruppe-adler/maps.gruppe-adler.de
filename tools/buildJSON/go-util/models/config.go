package models

// ConfigJSON describes the format of a config.json
type ConfigJSON struct {
	URL          string `json:"url"`
	Attribution  string `json:"attribution"`
	SourcePrefix string `json:"source-prefix"`
}
