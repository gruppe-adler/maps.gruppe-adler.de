package models

// MapboxSource describes the format of source within a mapbox style
type MapboxSource struct {
	Attribution string `json:"attribution"`
	Type        string `json:"type"`
	URL         string `json:"url"`
}

// MapboxLayer describes the format of layer within a mapbox style
type MapboxLayer struct {
	ID          string        `json:"id"`
	Type        string        `json:"type,omitempty"`
	Metadata    interface{}   `json:"metadata,omitempty"`
	Ref         string        `json:"ref,omitempty"`
	Source      string        `json:"source,omitempty"`
	SourceLayer string        `json:"source-layer,omitempty"`
	Minzoom     uint8         `json:"minzoom,omitempty"`
	Maxzoom     uint8         `json:"maxzoom,omitempty"`
	Interactive bool          `json:"interactive,omitempty"`
	Filter      []interface{} `json:"filter,omitempty"`
	Layout      interface{}   `json:"layout,omitempty"`
	Paint       interface{}   `json:"paint,omitempty"`
}

// MapboxStyle describes the format of mapbox style
type MapboxStyle struct {
	Version uint8                   `json:"version"`
	Name    string                  `json:"name"`
	Sprite  string                  `json:"sprite"`
	Glyphs  string                  `json:"glyphs"`
	Sources map[string]MapboxSource `json:"sources"`
	Layers  []MapboxLayer           `json:"layers"`
}
