import Head from "next/head";
import {useRouter} from "next/router";
import {db} from '../../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {useRef, useState} from 'react';


import styles from '../../styles/Experience.module.css';
import NoImage from '../../public/No-image-available.png';
import Image from "next/image";

export default function Add() {

    const experiencesCollectionRef = collection(db, 'experiences');
    const [progresspercent, setProgresspercent] = useState(0);
    const storage = getStorage();

    const router = useRouter();

    const companyLogoRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState();
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const removeSelectedImage = (event) => {
        event.preventDefault();
        companyLogoRef.current.value = "";
        setSelectedImage();
    };

    const form_submit = (event) => {
        event.preventDefault();
        const date = new Date();
        const file = event.target.company_logo.files[0];

        const data = {
            company: event.target.company.value,
            position: event.target.position.value,
            start_date: event.target.start_date.value,
            end_date: event.target.end_date.value,
            description: event.target.description.value,
            created_at: Date.now(),
        };

        const storageRef = ref(storage, `logo/${date.toISOString()}`);
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
                        company_logo_url : downloadURL,
                        company_logo_name : storageRef.name
                    }
                    addDoc(experiencesCollectionRef, newData);
                });
            }
        );

        router.push("/", undefined, { shallow: true });
    }

    return(
        <div className="wrapper">
            <Head>
                <title>Add Experience</title>
                <meta name="description" content="Sarono Resume App" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main className="main">

                <div className={styles.header}>

                    <div className={styles.content_header}>

                        <div className={styles.header_item}>
                            <h1 className={styles.header_title}>Add New Experiance</h1>
                        </div>

                    </div>

                </div>

                <div className={styles.wrapper_content}>

                    <form method="POST" onSubmit={form_submit}>

                        <div className="wrapper-form">
                            <label className="label" htmlFor="company">Company</label>
                            <div className="wrapper-input">
                                <input
                                    type="text" 
                                    name="company" 
                                    id="company" 
                                    className="form-input" 
                                    placeholder="Company" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="wrapper-form">
                            <label className="label" htmlFor="company_logo">Company Logo</label>
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
                                        <Image
                                            src={NoImage}
                                            alt="Company Logo"
                                            width={150}
                                        />                                     
                                    </div>
                                )}
                                <input
                                    id="company_logo"
                                    name="company_logo"
                                    className="form-input"
                                    accept="image/png, image/jpeg"
                                    type="file"
                                    onChange={imageChange}
                                    ref={companyLogoRef}
                                    required
                                />
                            </div>
                        </div>

                        <div className="wrapper-form">
                            <label className="label" htmlFor="position">Position</label>
                            <div className="wrapper-input">
                                <input
                                    type="text"
                                    name="position" 
                                    id="position" 
                                    className="form-input" 
                                    placeholder="Position" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="wrapper-form">
                            <label className="label" htmlFor="start_date">Start Date</label>
                            <div className="wrapper-input">
                                <input 
                                    type="date" 
                                    name="start_date" 
                                    id="start_date" 
                                    className="form-input" 
                                    placeholder="Start date" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="wrapper-form">
                            <label className="label" htmlFor="end_date">Start Date</label>
                            <div className="wrapper-input">
                                <input 
                                    type="date" 
                                    name="end_date" 
                                    id="end_date" 
                                    className="form-input" 
                                    placeholder="End date" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="wrapper-form">
                            <label className="label" htmlFor="description">Description</label>
                            <div className="wrapper-input">
                                <textarea
                                    className="form-input"
                                    name="description"
                                    id="description"
                                    rows="4"
                                    placeholder="Description"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="wrapper-form">        
                            <div className="wrapper-submit">
                                <button 
                                    type="submit" 
                                    className="btn-submit">
                                        Add New
                                </button>
                            </div>
                        </div>

                    </form>

                </div>

            </main>

        </div>
    )

}