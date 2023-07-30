import { useState, ChangeEvent } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";

interface UserData {
    id: string;
    name: string;
    age: string;
    username: string;
    nationality: string;
}

interface UsersResult {
    users: Array<UserData>
}

interface MovieData {
    name: string;
    yearOfPublication: string;
    rating: string;
    isInTheaters: boolean;
}

// interface MovieResult {
//     movies: Array<MovieData>
// }

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const GET_USER_BY_ID = gql`
  query User($id: ID!) {
    findUserId(id: $id) {
      name
      username
      age
      nationality
    }
  }
`;

const GET_USER_BY_NAME = gql`
  query User($name: String!) {
    findUserName(name: $name) {
      name
      username
      age
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    findMovieName(name: $name) {
      name
      yearOfPublication
      rating
      isInTheaters
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

function DisplayData() {
  const [userSearchedName, setUserSearchedName] = useState("James");
  const [userSearchedId, setUserSearchedId] = useState("2");
  const [movieSearchedName, setMovieSearchedName] = useState("Interstellar");

  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");

  const { data, loading, refetch } = useQuery<UsersResult>(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
    const [
    fetchName,
    { data: userSearchedNameData, error: userErrorName },
  ] = useLazyQuery(GET_USER_BY_NAME);
    const [
    fetchUserId,
    { data: userSearchedIdData, error: userErrorId },
  ] = useLazyQuery(GET_USER_BY_ID);
  const [
    fetchMovieName,
    { data: movieSearchedNameData, error: movieErrorName },
  ] = useLazyQuery(GET_MOVIE_BY_NAME);

  const [createUser] = useMutation(CREATE_USER_MUTATION);

  if (loading) {
    return <h6> DATA IS LOADING...</h6>;
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Name..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Age..."
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setAge(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Nationality..."
          onChange={(event) => {
            setNationality(event.target.value.toUpperCase());
          }}
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });

            refetch();
          }}
        >
          Create User
        </button>
      </div>
      {data &&
        data.users.map((
            user: {name: string;
            username: string;
            age: string;
            nationality: string;
        }) => {
          return (
            <div>
              <h6>Name: {user.name}</h6>
              <h6>Username: {user.username}</h6>
              <h6>Age: {user.age}</h6>
              <h6>Nationality: {user.nationality}</h6>
            </div>
          );
        })}

      <div>
        <input
          type="text"
          placeholder="James..."
          onChange={(event) => {
            setUserSearchedName(event.target.value);
          }}
        />
         <button
          onClick={() => {
            fetchName({
              variables: {
                name: userSearchedName,
              },
            });
          }}
        > 
          Fetch Name
        </button>
        <div>
          {userSearchedNameData && (
            <div>
              <h3>Name: {userSearchedNameData.findUserName.name}</h3>
              <h3>
                username: {userSearchedNameData.findUserName.username}
              </h3>
              <h3>
                Age: {userSearchedNameData.findUserName.age}
              </h3>
              <h3>
                Nationality: {userSearchedNameData.findUserName.nationality}
              </h3>{" "}
            </div>
          )}
          {userErrorName && <h3> There was an error fetching the data</h3>}
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="2..."
          onChange={(event) => {
            setUserSearchedId(event.target.value);
          }}
        />
         <button
          onClick={() => {
            fetchUserId({
              variables: {
                id: userSearchedId,
              },
            });
          }}
        > 
          Fetch User Id
        </button>
        <div>
          {userSearchedIdData && (
            <div>
              <h3>Name: {userSearchedIdData.findUserId.name}</h3>
              <h3>
                username: {userSearchedIdData.findUserId.username}
              </h3>
              <h3>
                Age: {userSearchedIdData.findUserId.age}
              </h3>
              <h3>
                Nationality: {userSearchedIdData.findUserId.nationality}
              </h3>{" "}
            </div>
          )}
          {userErrorId && <h3> There was an error fetching the data</h3>}
        </div>
      </div>

      {console.log('movieData:', movieData)}
      {movieData &&
        movieData.movies.map((movie: MovieData) => {
          return (
            <div>
              <h6>Movie Name: {movie.name}</h6>
              <h6>Movie Publication: {movie.yearOfPublication}</h6>
              <h6>Movie in Theaters: {movie.isInTheaters.toString()}</h6>
            </div>
          );
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(event) => {
            setMovieSearchedName(event.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovieName({
              variables: {
                name: movieSearchedName,
              },
            });
          }}
        >
          Fetch Movie Name
        </button>
        <div>
          {movieSearchedNameData && (
            <div>
              <h3>Movie Name: {movieSearchedNameData.findMovieName.name}</h3>
              <h3>
                Year Of Publication: {movieSearchedNameData.findMovieName.yearOfPublication}
              </h3>
              <h3>
                Rating: {movieSearchedNameData.findMovieName.rating}
              </h3>
              <h3>
                Is in Theaters: {JSON.stringify(movieSearchedNameData.findMovieName.isInTheaters)}
              </h3>{" "}
            </div>
          )}
          {movieErrorName && <h3> There was an error fetching the data</h3>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;