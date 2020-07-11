import React, { Component } from 'react';

class Articles extends Component {
  state = {
    posts: [],
    searchQuery: ''
  }

 getTopStories = (cb) => {
    const url = "https://hacker-news.firebaseio.com/v0/topstories.json";

    fetch(url).then(res => res.json()).then(data => {
      cb(true, data);
    })
}

componentDidMount = () => {
  const posts = JSON.parse(localStorage.getItem('posts'));
  if(!posts) {
    this.setPostsToStorage();
  }
  this.setState({
    posts: JSON.parse(localStorage.getItem('posts'))
  })
}

    setPostsToStorage = () => {
       this.getTopStories((succeed, data) => {
         if(succeed) {
          const promises = data
          .slice(0, 20)
          .map(id =>
             fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
             .then(res => res.json())
          );
          Promise.allSettled(promises).then(data => {
            const value = data.map(v => v.value);
            localStorage.setItem('posts', JSON.stringify(value))
          })
         }
       })        
    }


    handleInput = (e) => {
      const query = e.target.value;
      const posts = JSON.parse(localStorage.getItem('posts'));
      this.setState({
        posts: posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase())),
        searchQuery: query
      })
    }

    render() {
      const { posts, searchQuery } = this.state;
        return (
            <div className="container">
              <h1>Hackernews Stories</h1>
              <form className="search-form">
                <input type="text" onInput={this.handleInput} placeholder="Search by name" />
              </form>
              <div className="post-grid">
              {
               posts && posts.length ?
                posts && posts.map(post => 
                  <a href={post.url} target="_blank" key={post.id} className="post-card">
                    <h3>{post.title}</h3>
                    <div className="post-detail-wrapper">
                      <div>Author: {post.by}</div>
                      <div>Time: {post.time}</div>
                    </div>
                  </a>
                ) : <div>No results found for {searchQuery}</div>
              }
              </div>
            </div>
        );
    }
}

export default Articles;