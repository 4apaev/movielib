const keys = 'Title,Awards,Actors,Writer,Genre,Runtime,Director,Released,imdbRating'.split(',')

exports.details = movie => `
      <div id=popup>
        <button id=close>✖</button>
        <img src="${ movie.Poster }">
        <dl>
          ${ keys.map(key => `<dt>${ key }</dt><dd>${ movie[ key ] }</dd>`).join('') }
        </dl>
        <p>${ movie.Plot }</p>
      </div>`

exports.movie = ({ Title, Year, imdbID, Type, Poster }) => `
    <li>
      <div id=${ imdbID } class=img ${ Poster==='n/a' ? '' : `style="background-image: url(${ Poster });"` }></div>
      <h3>${ Title }</h3>
      <i>year: ${ Year }</i>
      <i>type: ${ Type }</i>
    </li>`

exports.option = value => `<option value="${ value }">`