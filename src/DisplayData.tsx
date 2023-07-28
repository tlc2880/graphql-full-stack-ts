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

// interface MovieData {
//     name: string;
// }

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

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
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
  const [movieSearched, setMovieSearched] = useState("");

  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");

  const { data, loading, refetch } = useQuery<UsersResult>(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [
    fetchMovie,
    { data: movieSearchedData, error: movieError },
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

      {movieData &&
        movieData.movies.map((movie: any) => {
          return <h6>Movie Name: {movie.name}</h6>;
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(event) => {
            setMovieSearched(event.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              <h6>MovieName: {movieSearchedData.movie.name}</h6>
              <h6>
                Year Of Publication: {movieSearchedData.movie.yearOfPublication}
              </h6>{" "}
            </div>
          )}
          {movieError && <h6> There was an error fetching the data</h6>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;