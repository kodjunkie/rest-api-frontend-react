import React, { Component } from "react";
import Image from "../../../components/Image/Image";
import { endpoint } from "../../../util/config";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: ""
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    fetch(endpoint + "/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
          query FetchPost($postId: ID!) {
            getPost(postId: $postId) {
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
          }
        `,
        variables: {
          postId: postId
        }
      })
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error("Failed to fetch post.");
        }
        this.setState({
          title: resData.data.getPost.title,
          author: resData.data.getPost.creator.name,
          date: new Date(resData.data.getPost.createdAt).toLocaleDateString(
            "en-US"
          ),
          content: resData.data.getPost.content,
          image: endpoint + resData.data.getPost.imageUrl
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
