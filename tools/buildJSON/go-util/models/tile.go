package models

type tileJSONLayer struct {
	ID     string            `json:"id"`
	Fields map[string]string `json:"fields"`
}

// TileJSON describes the format of a tile.json (or at least the parts we need)
type TileJSON struct {
	TileJSON     string          `json:"tilejson,omitempty"`
	Name         string          `json:"name,omitempty"`
	Description  string          `json:"description,omitempty"`
	Attribution  string          `json:"attribution,omitempty"`
	Scheme       string          `json:"scheme,omitempty"`
	Tiles        []string        `json:"tiles,omitempty"`
	Minzoom      uint8           `json:"minzoom"`
	Maxzoom      uint8           `json:"maxzoom"`
	VectorLayers []tileJSONLayer `json:"vector_layers,omitempty"`
}
