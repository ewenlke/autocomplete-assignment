import API from './GetAPI';
import { useState } from 'react';

export default function Search(props) {
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function SearchCode(r) {
    r.preventDefault();
    const RESPONSE = await API.get('/search/code', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.GH_TOKEN,
      },
      params: {
        // q: `${query}`,
        q: 'test',
      },
    }).catch(function (error) {
      if (error.message) {
        setErrorMsg(`error.message: ${error.message}`);
      }
    });

    if (RESPONSE.status === 200) {
      let data = RESPONSE.data;
      if (data.Services.length > 0) {
        props.fetchData({ data });
        setErrorMsg('Success');
      } else {
        setErrorMsg(`Search failed.`);
      }
    }
  }

  function searchInput(e) {
    setSearch(e.target.value);
  }

  return (
    <>
      <div className="search">
        <form onSubmit={SearchCode}>
          <input type="text" placeholder="Start query" onChange={searchInput} />
          <h3 className="error-msg">{errorMsg}</h3>
        </form>
      </div>
    </>
  );
}
