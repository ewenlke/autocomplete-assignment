import API from './GetAPI';
import { useState } from 'react';

export default function Search(props) {
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [list, setList] = useState('');
  const [timer, setTimer] = useState(null);

  async function SearchCode() {
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
          setList(res.data);
          return res.data;
        }
      })
      .then((r) => {
        console.log(r);
        if (r.items.length > 0) {
          setMsg(r.items[0].id);
        } else setMsg(`Search failed.`);
      })
      .catch(function (error) {
        if (error.message) {
          setMsg(`Error: ${error.message}`);
        }
      });
  }

  function searchInput(e) {
    setSearch(e.target.value);
    console.log(search);
  }

  function run() {
    clearTimeout(timer);
    const runner = setTimeout(SearchCode, 1000);
    setTimer(runner);
  }

  function mulFunction(e) {
    searchInput(e);
    run();
  }

  return (
    <>
      <div className="search">
        <form onSubmit={SearchCode}>
          <input type="text" placeholder="Start query" onChange={mulFunction} />
          <h3 className="error-msg">{msg}</h3>
        </form>
      </div>
    </>
  );
}
