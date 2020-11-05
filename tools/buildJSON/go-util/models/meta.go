package models

// MetaJSON describes the format of a meta.json (or at least the parts we need)
type MetaJSON struct {
	Author      string `json:"author"`
	DisplayName string `json:"displayName"`
	WorldName   string `json:"worldName"`
}
