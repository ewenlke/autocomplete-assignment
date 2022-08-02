import API from './GetAPI';
import { useEffect, useState } from 'react';
import './SearchBar.css';

export default function Search(props) {
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

  async function searchCode() {
    const RESPONSE = await API.get('/search/repositories', {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        q: `${search}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          let filtered = [];
          let list = res.data.items;
          let data = list.map((r) => {
            return `${r.description}`;
          });
          if (search.length > 0) {
            filtered = data.filter((item) => item.toLowerCase().indexOf(search.toLowerCase()));
            console.log(filtered);
          }
          setFilteredList(filtered);
          setList(list);
          setMsg('Search suggested');
          return res.data;
        } else setMsg(`Search failed.`);
      })
      // .then((r) => {
      //   if (r.items.length > 1) {
      //     setMsg(r.items[0].id);
      //   }
      // })
      .catch(function (error) {
        if (error.message) {
          setMsg(`Error: ${error.message}`);
        }
      });
  }

  function searchInput(e) {
    let userInput = e.target.value;
    setSearch(userInput);
    setMsg('');
    // console.log(search);
    setShowAutocomplete(true);
  }

  function run() {
    clearTimeout(timer);
    const runner = setTimeout(searchCode, 500);
    // const suggestion = setTimeout(filterSuggestion, 2000);
    setTimer(runner);
  }

  function mulFunction(e) {
    searchInput(e);
    run();
  }

  function test(e) {
    e.preventDefault();
    console.log(filteredList);
  }

  function select(e) {
    setSearch(e.target.innerText);
    setShowAutocomplete(false);
    setMsg('');
  }

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
      <div className="search">
        <form onSubmit={test}>
          <h3 className="header-text">{msg}</h3>
          <input type="text" placeholder="Start query" className="search-one" onChange={mulFunction} value={search} autoComplete="off" />
          {showAutocomplete && search ? show() : null}
        </form>
      </div>
    </>
  );
}
