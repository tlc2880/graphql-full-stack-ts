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

const GET_MOVIE_BY_ID = gql`
  query Movie($id: ID!) {
    findMovieId(id: $id) {
      name
      yearOfPublication
      rating
      isInTheaters
    }
  }
`;

const GET_MOVIE_BY_RATING = gql`
  query Movie($rating: String!) {
    findMovieRating(rating: $rating) {
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

const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsername($input: UpdateUsernameInput!) {
    updateUsername(input: $input) {
      id
      username
    }
  }
`;

function DisplayData() {
  const [userSearchedName, setUserSearchedName] = useState("James");
  const [userSearchedId, setUserSearchedId] = useState("2");
  const [movieSearchedName, setMovieSearchedName] = useState("Interstellar");
  const [movieSearchedId, setMovieSearchedId] = useState("1");
  const [movieSearchedRating, setMovieSearchedRating] = useState("PG");

  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [userId, setUserId] = useState("0");
  const [newUsername, setNewUsername] = useState("");

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
  const [
    fetchMovieId,
    { data: movieSearchedIdData, error: movieErrorId },
  ] = useLazyQuery(GET_MOVIE_BY_ID);
  const [
    fetchMovieRating,
    { data: movieSearchedRatingData, error: movieErrorRating },
  ] = useLazyQuery(GET_MOVIE_BY_RATING);

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [updateUserName] = useMutation(UPDATE_USERNAME_MUTATION);

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
    
    <div>
      <input
        type="text"
        placeholder="User Id..."
        onChange={(event) => {
          setUserId(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New Username..."
        onChange={(event) => {
          setNewUsername(event.target.value);
        }}
      />
      <button
          onClick={() => {
            updateUserName({
              variables: {
                input: { userId, newUsername },
              },
            });

            refetch();
          }}
        >
          Update Username
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
              <h6>Name: {userSearchedNameData.findUserName.name}</h6>
              <h6>
                username: {userSearchedNameData.findUserName.username}
              </h6>
              <h6>
                Age: {userSearchedNameData.findUserName.age}
              </h6>
              <h6>
                Nationality: {userSearchedNameData.findUserName.nationality}
              </h6>{" "}
            </div>
          )}
          {userErrorName && <h6> There was an error fetching the data</h6>}
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
              <h6>Name: {userSearchedIdData.findUserId.name}</h6>
              <h6>
                username: {userSearchedIdData.findUserId.username}
              </h6>
              <h6>
                Age: {userSearchedIdData.findUserId.age}
              </h6>
              <h6>
                Nationality: {userSearchedIdData.findUserId.nationality}
              </h6>{" "}
            </div>
          )}
          {userErrorId && <h6> There was an error fetching the data</h6>}
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
              <h6>Movie Name: {movieSearchedNameData.findMovieName.name}</h6>
              <h6>
                Year Of Publication: {movieSearchedNameData.findMovieName.yearOfPublication}
              </h6>
              <h6>
                Rating: {movieSearchedNameData.findMovieName.rating}
              </h6>
              <h6>
                Is in Theaters: {JSON.stringify(movieSearchedNameData.findMovieName.isInTheaters)}
              </h6>{" "}
            </div>
          )}
          {movieErrorName && <h6> There was an error fetching the data</h6>}
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="1..."
          onChange={(event) => {
            setMovieSearchedId(event.target.value);
          }}
        />
         <button
          onClick={() => {
            fetchMovieId({
              variables: {
                id: movieSearchedId,
              },
            });
          }}
        > 
          Fetch Movie Id
        </button>
        <div>
          {movieSearchedIdData && (
            <div>
              <h6>MovieName: {movieSearchedIdData.findMovieId.name}</h6>
              <h6>
                Year Of Publication: {movieSearchedIdData.findMovieId.yearOfPublication}
              </h6>
              <h6>
                Rating: {movieSearchedIdData.findMovieId.rating}
              </h6>
              <h6>
                Is in Theaters: {JSON.stringify(movieSearchedIdData.findMovieId.isInTheaters)}
              </h6>{" "}
            </div>
          )}
          {movieErrorId && <h6>There was an error fetching the data</h6>}
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="PG..."
          onChange={(event) => {
            setMovieSearchedRating(event.target.value);
          }}
        />
         <button
          onClick={() => {
            fetchMovieRating({
              variables: {
                rating: movieSearchedRating,
              },
            });
          }}
        > 
          Fetch Movie Rating
        </button>
        <div>
          {movieSearchedRatingData && (
            <div>
              <h6>MovieName: {movieSearchedRatingData.findMovieRating.name}</h6>
              <h6>
                Year Of Publication: {movieSearchedRatingData.findMovieRating.yearOfPublication}
              </h6>
              <h6>
                Rating: {movieSearchedRatingData.findMovieRating.rating}
              </h6>
              <h6>
                Is in Theaters: {JSON.stringify(movieSearchedRatingData.findMovieRating.isInTheaters)}
              </h6>{" "}
            </div>
          )}
          {movieErrorRating && <h6> There was an error fetching the data</h6>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;