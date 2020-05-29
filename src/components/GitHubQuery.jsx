import React from "react";
import { useQuery, gql, useLazyQuery ,useMutation} from "@apollo/client";
import { useState } from "react";
import './GitStyle.css';
const QUERY = gql`
  query getRepos($number_of_repos: Int!,$number_of_followers: Int!) {
    viewer {
      name
      login
      email
      followers(last:$number_of_followers){
        nodes{
             name
        }
      }
      repositories(last: $number_of_repos) {
        nodes {
          name
          id
        }
      }
    }
  }
`;

const ARCHIVE_REPOSITORY = gql`

    mutation archiveRepository($repositoryId:ID!) {

      archiveRepository(input:{repositoryId:$repositoryId}){
    
            repository{
              name
            }
          }
    }
`;

const CREATE_REPOSITORY = gql`

    mutation createRepository($name:String!,$visibility:RepositoryVisibility,$description:String!) {

      createRepository(input:{name:$name,visibility:$visibility,description:$description}) { 
      
        repository{
          
          name
          description
          
        }
      
      }
    }
`;


const GitHubQuery = () => {
  
  const [showFollowers,setshowFollowers] = useState(0);
  const [id,setID] = useState(null);
  const [repoControll,setrepoControll] = useState(null);

  const { loading, data, error } = useQuery(QUERY, {
    variables: { number_of_repos: 10 , number_of_followers:100},
  });

  if (loading) return <div>loading...</div>;
  
  if (error) return (

    <div className = "Error">
      Error, el token introducido es invalido!!
      
      <p>https://github.com/settings/tokens</p>

    </div>

  );

  return (
    <div className = "All">
       
       <div className = "Style">
          <div className = "User">
            <p>User: {data.viewer.name} </p>
            <p>Name User: {data.viewer.login}</p>
            <p>Email: {data.viewer.mail}</p>
            <p  onClick={() =>{setshowFollowers(1)}}>Numero de Seguidores: {data.viewer.followers.nodes.length}</p>
            {showFollowers===1? 
              data.viewer.followers.nodes.map((follower) => (

                <li key={follower.id}>{follower.name}</li>

              ))      
            :null}
          </div> 
          <div className = "Repos">
            <ul>
              Repositorios.
              {data.viewer.repositories.nodes.map((repo) => (
                <p onClick={() =>{setID(repo.id)}} key={repo.id}>{repo.name}</p>
              ))}
            </ul>
       
        <div className = "ShowCharac">

                {id!==null?

                    <div>
                    <Archive id = {id}></Archive>
                    </div>
                
                :null}
        </div>
       </div>  

       </div> 
      
      <div className = "CreateRepo">

        <div className = "Button">
                  <button
                      id="search"
                      className="ButtonField"
                      onClick={() =>setrepoControll(1)}
                  >
                  Crear Repositorio
                  </button>
        </div>

        <div className = "CraerRepo">

                {repoControll!==null?
                  
                    <div>
                      <CrearRepositorio></CrearRepositorio>
                    </div>
                    
                :null}

                
        </div>
      </div>

    </div>
  );
};


export default GitHubQuery;

function Archive({id}){

  const [archiveRepository, { data }] = useMutation(ARCHIVE_REPOSITORY);
  archiveRepository({ variables: { repositoryId: id}});
    
  if(id){
    
    if(data){

      console.log(data);
      return(

        <div>
            El repositorio {data.archiveRepository.repository.name} se ha archivado con Exito.
            
        </div>
    
      );


    }else{

      return(

        <div>
            
        </div>
    
      );

    }
    

  }
  
}

function CrearRepositorio(){

  const [nameRepository,setnameRepository] = useState(null);
  const [visiRepository,setvisiRepository] = useState(null);
  const [desRepository,setdesRepository] = useState(null);
  const [control,setControl] = useState(null);

  

  return(

    <div className = "CrearRepositorio">

        <div className = "InputName">
            <input
                id="name"
                className="InputField"
                placeholder="Introduce Nombre"
                type="text"
            />
        </div>
        <div className = "InputVisibilidad">
            <input
                id="visi"
                className="InputField"
                placeholder="Introduce Visibilidad"
                type="text"
            />
        </div>

        <div className = "InputDescripcion">
            <input
                id="des"
                className="InputField"
                placeholder="Introduce Descripcion"
                type="text"
            />
        </div>

        <div className = "ButtonRepo">
          <button
              id="search"
              className="ButtonField"
              onClick={() => 
                    
                {
                  setnameRepository(document.getElementById("name").value)
                  setvisiRepository(document.getElementById("visi").value)
                  setdesRepository(document.getElementById("des").value)
                  setControl(1);

                  
                }
                
              }
              >
              Confirmar Crear Repositorio
          </button>
        </div>

        {control?(

          <div>
            <MutacionCrearRepo name ={nameRepository} visibility = {visiRepository}  description = {desRepository}></MutacionCrearRepo>
          </div>
                
        )
        :null}

      
    </div>

  );
  


}


function MutacionCrearRepo({name,visibility,description}){

  
    const [createRepository, { data,error }] = useMutation(CREATE_REPOSITORY);
    createRepository({ variables: { name:name,visibility:visibility,description:description}});

    if (error) return (

      <div className = "Error">

          El repositorio ya existe
  
      </div>
    );

    return(

      <div>
        Soy La Funcion
        {name}
        {visibility}
        {description}
      </div>

    );
  
}

