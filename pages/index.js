import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react';
import {} from 'firebase/firestore';
import {db} from '../firebaseConfig';

import Avatar from '../public/photo.png';
import Link from 'next/link';
import { deleteObject, getStorage, ref } from 'firebase/storage';

export default function Home() {

  const [user, setUser] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [isEditName, setisEditName] = useState(false);
  const [nameState, setnameState] = useState("");
  const titleInput = useRef(null);
  const [isEditAge, setisEditAge] = useState(false);
  const [ageState, setAgeState] = useState("");
  const ageInput = useRef(null);
  const storage = getStorage();

  const userCollectionRef = collection(db, 'users');
  const experiencesCollectionReff = collection(db, 'experiences');

  useEffect(()=> {

    const getData = async () => {

      const experiencesData = await getDocs(experiencesCollectionReff);
      const userData = await getDocs(userCollectionRef);
      const oneUser = userData.docs.map((doc) => ({
        ...doc.data(),
        id:doc.id
      }));
      setUser(oneUser[0]);

      setExperiences(
        experiencesData.docs.map((doc) => ({
          ...doc.data(),
          id:doc.id
        }))
      );

    }

    getData();

  }, []);

  const deleteExperience = (id,name) => {
      const experiencesCollectionRef = doc(db, "experiences", id);
      deleteDoc(experiencesCollectionRef);
      const imageRef = ref(storage, "logo/"+name);
      deleteObject(imageRef);
      const result = experiences.filter((experience) => {
          return experience.id !== id;
      });

      setExperiences(result);
  };


  return (
    <div className="wrapper">

      <Head>
        <title>Sarono Mediatechindo - Resume App</title>
        <meta name="description" content="Sarono Resume App" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="main">

        <div className={styles.profile}>

          <div className={styles.profile_content_wrapper}>

            <div className={styles.avatar}>
              <img
                src={user.avatar_url}
                alt="Picture of the author"
                width={280}
                height={300}
              />
            </div>

            <div className={styles.content_profile}>

              <div className={styles.profile_item}>
                <h1 className={styles.profile_name}>{user.name}</h1>
              </div>

              <div className={styles.profile_item}>
                <p className={styles.profile_age}>Age : {user.age}</p>
              </div>

              <div className={styles.profile_action}>
                <Link className={styles.button_edit_profile} href="/profile/edit/1">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 self-center text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                  </svg>
                  <span>Edit Profile</span>
                </Link>

              </div>

            </div>

          </div>               

        </div>

        <div className={styles.experience}>

          <div className={styles.experience_header}>

            <h4 className={styles.experience_title}>Experience</h4>
            <Link className={styles.link_add} href="/experience/add">New Experience</Link>

          </div>

          <div className={styles.experience_content_wrapper}>

            <div className={styles.experience_content}>

              {experiences.map((experience) => (
                  
                  <div key={experience.id} className={styles.experience_item}>

                  <div className={styles.experience_item_thumb}>

                    { experience.company_logo_url ? (
                        <img
                        src={experience.company_logo_url}
                        alt="Company Logo"
                        width={150}
                        height={150}
                      />
                    ):(
                      <Image
                        src={Avatar}
                        alt="Company Logo"
                        width={150}
                      />
                    )}
                    
                  </div>

                  <div className={styles.experience_item_content}>
                    <h4 className={styles.experience_item_company}>{experience.company}</h4>
                    <p className={styles.experience_item_position}>{experience.position}</p>
                    <p className={styles.experience_item_date}>{experience.start_date} -{" "} {experience.end_date}</p>                  
                    <p className={styles.experience_item_description}>{experience.description}</p>
                    <div className="flex justify-end">
                      <Link
                          href={`experience/edit/${experience.id}`}
                      >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 mr-4 cursor-pointer "
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                          </svg>
                      </Link>
                      <div
                          onClick={()=> {
                            deleteExperience(experience.id, experience.company_logo_name)
                          }}
                      >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 cursor-pointer"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                          </svg>
                      </div>
                  </div>
                  </div>

                  </div>
              ))}           

            </div>

          </div>

        </div>

      </main>

      <footer className="footer">
        <div className="copyright">© {new Date().getFullYear()} All rights reserved. Sarono Mediatechindo</div>
      </footer>

    </div>
  )
}
