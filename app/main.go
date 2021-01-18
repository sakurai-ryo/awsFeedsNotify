// docker-compose exec app go run main.go
// get github.com/mmcdole/gofeed

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/mmcdole/gofeed"
)

type Feed struct {
	Title      string
	Link       string
	Categories []string
	AuthorName string
}
type Field struct {
	Title string `json:"title"`
	Value string `json:"value"`
}
type Attachment struct {
	Color      string  `json:"color"`
	AuthorName string  `json:"author_name"`
	Fields     []Field `json:"fields"`
}
type Payload struct {
	Attachments []Attachment `json:"attachments"`
	Username    string       `json:"username"`
	IconEmoji   string       `json:"icon_emoji"`
	IconURL     string       `json:"icon_url"`
	Channel     string       `json:"channel"`
}

const webhookURL = "https://hooks.slack.com/services/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"

// Feedの取得を行う
func getfeeds() ([]Feed, error) {
	url := "https://dev.classmethod.jp/feed"

	fmt.Println(url)

	// RSSの取得
	fp := gofeed.NewParser()
	feed, err := fp.ParseURL(url)
	if err != nil {
		return nil, fmt.Errorf("context: %v", err)
	}
	fmt.Println(feed)

	var feeds []Feed
	// 必要な情報のみ取り出す
	for _, item := range feed.Items {
		feeds = append(feeds, Feed{Title: item.Title, Link: item.Link, Categories: item.Categories, AuthorName: item.Author.Name})
	}
	return feeds, nil
}

// Payloadを作成する
func createPayload(feeds []Feed) (*Payload, error) {

	var attachments []Attachment
	payload := &Payload{}

	for _, item := range feeds {
		attachment := Attachment{}
		field := Field{}
		attachment.AuthorName = item.AuthorName
		attachment.Color = "#b0c4de"
		categoryStr := ""
		for _, st := range item.Categories {
			categoryStr += fmt.Sprintf("%v,  ", st)
		}
		field.Title = item.Title
		field.Value = fmt.Sprintf("%v\n%v\n", item.Link, categoryStr)
		attachment.Fields = []Field{field}
		attachments = append(attachments, attachment)
	}

	payload.Attachments = attachments
	payload.Username = "aws_daily_feeds"
	payload.Channel = "#aws-bill"
	payload.IconEmoji = ":ghost:"

	return payload, nil
}

// PayloadをJSON文字列に転換する
func convertPayloadToJSON(payload *Payload) (string, error) {
	p, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("context: %v", err)
	}
	return string(p), nil
}

// Slackにメッセージを送信する
func sendMessage(payload string) (err error) {
	resp, err := http.PostForm(webhookURL, url.Values{"payload": {payload}})
	log.Println(resp)
	if err != nil {
		return fmt.Errorf("context: %v", err)
	}
	defer resp.Body.Close()
	return nil
}

func main() {
	// hatena := "http://b.hatena.ne.jp/hotentry/it.rss"
	// aws := "https://dev.classmethod.jp/feed"

	// Feedsの取得
	feeds, feedsErr := getfeeds()
	if feedsErr != nil {
		log.Fatal(feedsErr)
	}

	// Payloadの作成
	payload, messageErr := createPayload(feeds)
	if messageErr != nil {
		log.Fatal(messageErr)
	}

	jsonPayload, jsonErr := convertPayloadToJSON(payload)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	// Slackに送信
	slackErr := sendMessage(jsonPayload)
	if slackErr != nil {
		log.Fatal(slackErr)
		os.Exit(1)
	}
}
