import API from './GetAPI';
import { useEffect, useState } from 'react';

export default function Search() {
  const defaultState = [
    {
      id: '',
      node_id: '',
      name: '',
      full_name: '',
      owner: {
        login: '',
        id: '',
        node_id: '',
        avatar_url: '',
        gravatar_id: '',
        url: '',
        received_events_url: '',
        type: '',
        html_url: '',
        followers_url: '',
        following_url: '',
        gists_url: '',
        starred_url: '',
        subscriptions_url: '',
        organizations_url: '',
        repos_url: '',
        events_url: '',
        site_admin: '',
      },
      private: '',
      html_url: '',
      description: '',
      fork: '',
      url: '',
      created_at: '',
      updated_at: '',
      pushed_at: '',
      homepage: '',
      size: '',
      stargazers_count: '',
      watchers_count: '',
      language: '',
      forks_count: '',
      open_issues_count: '',
      master_branch: '',
      default_branch: '',
      score: '',
      archive_url: '',
      assignees_url: '}',
      blobs_url: '',
      branches_url: '}',
      collaborators_url: '',
      comments_url: '',
      commits_url: '',
      compare_url: '',
      contents_url: '',
      contributors_url: '',
      deployments_url: '',
      downloads_url: '',
      events_url: '',
      forks_url: '',
      git_commits_url: '',
      git_refs_url: '',
      git_tags_url: '',
      git_url: '',
      issue_comment_url: '',
      issue_events_url: '',
      issues_url: '',
      keys_url: '',
      labels_url: '',
      languages_url: '',
      merges_url: '',
      milestones_url: '',
      notifications_url: '',
      pulls_url: '',
      releases_url: '',
      ssh_url: '',
      stargazers_url: '',
      statuses_url: '',
      subscribers_url: '',
      subscription_url: '',
      tags_url: '',
      teams_url: '',
      trees_url: '',
      clone_url: '',
      mirror_url: '',
      hooks_url: '',
      svn_url: '',
      forks: '',
      open_issues: '',
      watchers: '',
      has_issues: '',
      has_projects: '',
      has_pages: '',
      has_wiki: '',
      has_downloads: '',
      archived: '',
      disabled: '',
      visibility: '',
      license: {
        key: '',
        name: '',
        url: '',
        spdx_id: '',
        node_id: '',
        html_url: '',
      },
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
    const response = await API.get('/search/repositories', {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        q: `${userInput}`,
      },
    })
      .then((res) => {
        if (res.status === 200 && userInput) {
          console.log(userInput);
          let filtered = [];
          let list = res.data.items;
          let data = list.map((r) => {
            return `${r.description}`;
          });
          if (userInput.length > 0) {
            filtered = data.filter((item) => item.toLowerCase().indexOf(userInput.toLowerCase()));
            console.log(filtered);
          }
          setFilteredList(filtered);
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
          <h2 className="header-text">Github repository search</h2>
          <h3 className="message-text">{msg}</h3>
          <input type="text" placeholder="Start query" className="search" onChange={mulFunction} value={search} />
          {showAutocomplete && search ? show() : null}
        </form>
      </div>
    </>
  );
}
