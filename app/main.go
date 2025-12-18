package main

import (
	"fmt"
	"log"
	"net/http"
)

type Simple struct {
	Name        string
	Description string
	Url         string
}

// func handler(w http.ResponseWriter, r *http.Request) {
//     simple := Simple{"Hello", "World", r.Host}

//     jsonOutput, _ := json.Marshal(simple)

//     w.Header().Set("Content-Type", "application/json")

//	    fmt.Fprintln(w, string(jsonOutput))
//	}
//
// ...
func SimpleFactory(host string) Simple {
	fmt.Println("Application:", "Hello")
	return Simple{"Hello", "World", host}
}

// ...
func handler(w http.ResponseWriter, r *http.Request) {
	SimpleFactory(r.Host)
}

func main() {
	fmt.Println("Server started on port 4444")
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":4444", nil))
}
