import API from './GetAPI';
import { useEffect, useState } from 'react';

export default function Search() {
  const defaultState = [
    {
      login: '',
      id: '',
      node_id: '=',
      avatar_url: '',
      gravatar_id: '',
      url: '',
      html_url: '',
      followers_url: '',
      subscriptions_url: '',
      organizations_url: '',
      repos_url: '',
      received_events_url: 's',
      type: '',
      score: '',
      following_url: '',
      gists_url: '',
      starred_url: '',
      events_url: '',
      site_admin: '',
    },
  ];
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [list, setList] = useState(defaultState);
  const [timer, setTimer] = useState(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredList, setFilteredList] = useState('');

  // Search call to Github API
  async function searchCode(e) {
    let userInput = e.target.value;
    const response = await API.get('/search/users', {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        q: `${userInput}`,
      },
    })
      .then((res) => {
        if (res.status === 200 && userInput) {
          // console.log(userInput);
          let filtered = [];
          let list = res.data.items;
          let data = list.map((r) => {
            return `${r.login}`;
          });
          // if (userInput.length > 0) {
          //   filtered = data.filter((item) => item.toLowerCase().indexOf(userInput.toLowerCase()));
          //   console.log(data);
          // }
          setFilteredList(data);
          setList(list);
          setMsg('Search suggested');
          // console.log(search);
        } else setMsg(`Search failed.`);
      })
      .catch(function (error) {
        if (error.response.status === 403) {
          setMsg('Search limit exceeded. Please try again later.');
          setFilteredList('');
        } else if (error.response.status === 422) {
          setMsg('');
        } else if (error.message) {
          setMsg(`Error: ${error.message}`);
        }
      });
  }

  //Log user search input
  function searchInput(e) {
    let userInput = e.target.value;
    setSearch(userInput);
    setMsg('');
    // console.log(search);
    setShowAutocomplete(true);
  }

  //Timer to run search API call 0.5sec after user stopped typing
  function run(e) {
    clearTimeout(timer);
    const runner = setTimeout(function () {
      searchCode(e);
    }, 500);
    setTimer(runner);
  }

  //Run multiple functions on input change
  function mulFunction(e) {
    searchInput(e);
    run(e);
  }

  //Autofill input field upon click on selected autocomplete text
  function select(e) {
    setSearch(e.target.innerText);
    setShowAutocomplete(false);
    setMsg('');
  }

  //Show autocomplete field upon input
  function show() {
    return (
      <ul className="suggestion">
        {filteredList &&
          filteredList.map((list, i) => (
            <li key={i} onClick={select}>
              {list}
            </li>
          ))}
      </ul>
    );
  }

  return (
    <>
      <div>
        <form>
          <h2 className="header-text">Github users search</h2>
          <h3 className="message-text">{msg}</h3>
          <input type="text" placeholder="Start query" className="search" onChange={mulFunction} value={search} />
          {showAutocomplete && search ? show() : null}
        </form>
      </div>
    </>
  );
}
