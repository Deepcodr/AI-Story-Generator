import React, { useState, useEffect } from 'react';
import './custom.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import deepai from 'deepai';
deepai.setApiKey('quickstart-QUdJIGlzIGNvbWluZy4uLi4K');

function StoryGeneration(props) {
  const [User, setUser] = useState(null);
  const [storyId, setStoryId] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    var token = localStorage.getItem('jwt');
    axios.get('http://127.0.0.1:5000/session', {
      headers: {
        'x-access-token': token
      }
    }).then((response) => {
      if (response.data === false) {
        nav('/login');
      }
      else {
        setUser(response.data.username);
      }
    })
  }, [nav])

  const [storyPrompt, setstoryPrompt] = useState('');
  const [storyText, setstoryText] = useState('');
  const [isStory, setStory] = useState(false);

  const handleInputChange = (e) => {
    setstoryPrompt(e.target.value);
  };

  const generateStory = async () => {
    if (storyPrompt === '') {
      setStory(false);
      alert("Enter A Valid Prompt");
    }
    else {
      setStory(true);
      axios.post('http://127.0.0.1:5000/generateStory', {
        prompt: storyPrompt
      }).then(function (response) {
        setstoryText(response.data.output);
        setStory(true);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }

  const handleSave = async () => {
    const element = document.createElement("a");
    const file = new Blob([storyText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myStory.txt";
    document.body.appendChild(element); 
    alert("File Will Be Downloaded");
    element.click();
    // await axios.post('http://127.0.0.1:5000/savestory', {
    //   username: User,
    //   prompt: storyPrompt,
    //   story: storyText,
    //   upvotes: 0,
    // }, {
    //   headers: {
    //     'x-access-token': localStorage.getItem('jwt')
    //   }
    // }).then(function (response) {
    //   if (response.data.status === 200) {
    //     var storyobj = JSON.parse(response.data.message);
    //     setStoryId(storyobj['_id']);
    //     alert("Story Saved");
    //   }
    //   else {
    //     alert(response.data.message);
    //   }
    // }).catch(function (error) {
    //   console.log(error);
    // });
  }

  const handleShare = async () => {
    axios.post('http://127.0.0.1:5000/savestory', {
      username: User,
      prompt: storyPrompt,
      story: storyText,
      upvotes: 0,
    }, {
      headers: {
        'x-access-token': localStorage.getItem('jwt')
      }
    }).then(function (response) {
      if (response.data.status === 200) {
        var storyobj = JSON.parse(response.data.message);
        axios.post('http://127.0.0.1:5000/sharestory', {
          storyId: storyobj['_id']
        }, {
          headers: {
            'x-access-token': localStorage.getItem('jwt')
          }
        }).then(function (response) {
          if (response.data.status === 200) {
            nav('/feed');
          }
          else {
            alert(response.data.message);
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
      else {
        alert(response.data.message);
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1>Enter Your Prompt Here</h1>
      <textarea
        type="text"
        value={storyPrompt}
        onChange={handleInputChange}
        className="glow-input m-4 w-50"
      />
      {
        isStory ? (<div className='border rounded p-2 m-2 text-center '>
          <p>{storyText}</p>
          <button onClick={handleSave} className="btn btn-dark text-light border me-3">Download</button>
          <button onClick={handleShare} className="btn btn-dark text-light border">Save & Share On Feed</button>
        </div>) : ''
      }
      <div className="mt-4">
        <Link to="/" className="btn text-light border me-3 ">Home</Link>
        <button className='btn text-light border border rounded' onClick={generateStory}>Generate Story</button>
      </div>
    </div>
  );
}

export default StoryGeneration;