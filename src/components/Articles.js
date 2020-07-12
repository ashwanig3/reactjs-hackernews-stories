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

    handleSort = (e) => {
      const val = e.target.value;
      const posts = JSON.parse(localStorage.getItem('posts'));
      const SortedArr = val && val === 'Low to high' ?  posts.sort((a,b) => a.score - b.score) : posts.sort((a,b) => a.score - b.score).reverse();
      this.setState({
        posts: SortedArr
      })
    }

     msToTime = (duration) => {
      var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);
  
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
  
      return hours + ":" + minutes + ":" + seconds;
  }
 
    render() {
      const { posts, searchQuery } = this.state;
        return (
            <div className="container">
              <h1>Hackernews Stories</h1>
              <form className="search-form">
                <input type="text" onInput={this.handleInput} placeholder="Search by name" />
              </form>
              <form className="sort-form mt3">
                <label>Sort by score:</label>
                <select id="sort_by_score" name="sort_by_score" required="required" onChange={this.handleSort}>
                    <option value="" selected="true"></option>
                    <option value="Low to high">Low to high</option>
                    <option value="High to low">High to low</option>
                </select>              
              </form>
              <div className="post-grid">
              {
               posts && posts.length ?
                posts && posts.map(post => 
                  <a href={post.url} target="_blank" key={post.id} className="post-card">
                    <h3>{post.title}</h3>
                    <div className="post-detail-wrapper">
                      <div>Author: {post.by}</div>
                      <div>Score: { post.score }</div>
                    </div>
                    <div>Time: {this.msToTime(post.time)}</div>
                  </a>
                ) : <div>No results found for {searchQuery}</div>
              }
              </div>
            </div>
        );
    }
}

export default Articles;