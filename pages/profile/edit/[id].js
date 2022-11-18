import Head from "next/head";
import {useRouter} from "next/router";
import {db} from '../../../firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {useRef, useState} from 'react';


import styles from '../../../styles/User.module.css';
import Avatar from '../../../public/photo.png';

const EditProfile = (props) => {

    const router = useRouter();
    const storage = getStorage();
    const [progresspercent, setProgresspercent] = useState(0);
    const deletedImageRef = ref(
        storage,
        "avatar/" + props.user.avatar_name
    );    

    const avatarRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState();
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const removeSelectedImage = (event) => {
        event.preventDefault();
        avatarRef.current.value = "";
        setSelectedImage();
    };

    const form_submit = (event) => {
        event.preventDefault();
        const date = new Date();

        const usersCollectionRef = doc(
            db,
            "users",
            props.user.id
        );        

        const data = {
            name: event.target.name.value,
            age: event.target.age.value,
            created_at: Date.now(),
        };
        const file = event.target.avatar.files[0];

        if(file){
            const storageRef = ref(storage, `avatar/${date.toISOString()}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    setProgresspercent(progress);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const newData = {
                            ...data,
                            avatar_url : downloadURL,
                            avatar_name : storageRef.name
                        }
                        updateDoc(usersCollectionRef, newData);
                        deleteObject(deletedImageRef);
                    });
                }
            );
        }else{
            const newData = {
                ...data,
            }
            updateDoc(usersCollectionRef, newData);
        }      

        router.push("/", undefined, { shallow: true });
    }

    return(
        <div className="wrapper">
            <Head>
                <title>Edit User Profile</title>
                <meta name="description" content="Sarono Resume App" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main className="main">

                <div className={styles.header}>

                    <div className={styles.content_header}>

                        <div className={styles.header_item}>
                            <h1 className={styles.header_title}>Edit User Profile</h1>
                        </div>

                    </div>

                </div>

                <div className={styles.wrapper_content}>

                    <form method="POST" onSubmit={form_submit}>

                    <div className="wrapper-form">
                            <label className="label" htmlFor="company_logo">Avatar</label>
                            <div className="wrapper-input">
                                {selectedImage ? (
                                    <div>
                                        <img
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Thumb"
                                        />
                                        <div className="image_action">

                                            <button onClick={removeSelectedImage}>
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
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <img
                                        src={props.user.avatar_url}
                                        alt="Thumb"
                                        />                                        
                                    </div>
                                )}
                                <input
                                    id="avatar"
                                    name="avatar"
                                    className="form-input"
                                    accept="image/png, image/jpeg"
                                    type="file"
                                    onChange={imageChange}
                                    ref={avatarRef}                                 
                                />
                            </div>
                        </div>

                        <div className="wrapper-form">
                            <label className="label" htmlFor="company">Name</label>
                            <div className="wrapper-input">
                                <input
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    className="form-input" 
                                    placeholder="Your Name" 
                                    defaultValue={props.user.name}
                                    required 
                                />
                            </div>
                        </div>                       

                        <div className="wrapper-form">
                            <label className="label" htmlFor="position">Age</label>
                            <div className="wrapper-input">
                                <input
                                    type="number"
                                    name="age" 
                                    id="age" 
                                    className="form-input" 
                                    placeholder="Age" 
                                    defaultValue={props.user.age}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="wrapper-form">        
                            <div className="wrapper-submit">
                                <button 
                                    type="submit" 
                                    className="btn-submit">
                                        Edit user
                                </button>
                            </div>
                        </div>

                    </form>

                </div>

            </main>

        </div>
    )

}

export async function getStaticProps(context){
    const usersCollectionRef = doc(db, 'users', context.params.id);
    const user = await getDoc(usersCollectionRef);

    return {
        props: {
            user: {
                id: context.params.id,
                ...user.data()
            }
        },
        revalidate: 600
    }
}


export async function getStaticPaths() {
    const usersCollectionRef = collection(db, "users");
    const users = await getDocs(usersCollectionRef);

    return {
        paths: users.docs.map((doc) => ({ params: { id: doc.id } })),
        fallback: false,
    };
}


export default EditProfile;