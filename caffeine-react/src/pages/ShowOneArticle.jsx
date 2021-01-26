import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { EditText, EditTextarea } from 'react-edit-text';

export default function ShowOneArticle(props) {
    const history = useHistory();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    const { article_id } = useParams()
    const [selectArtcile, setSelectArticle] = useState(props.selectArtcile)
    const [updateArticle, setUpdateArticle] = useState({ title: selectArtcile.title, content: selectArtcile.content, img: selectArtcile.img });
    const { title, img, content } = selectArtcile
    console.log(selectArtcile)
    const articleId = selectArtcile._id;

    useEffect(() => {
        if (!title) {
            axios.get('http://localhost:5000/api/article/')
                .then(res => {
                    let article = res.data.msg.find(ele => ele._id == article_id)
                    setSelectArticle(article)
                    //data.msg[0]._id
                    console.log(res.data)
                })
        }

    }, [])


    const deleteArticle = (articleId) => {

        axios.delete(`http://localhost:5000/api/article/${articleId}`)
            .then(data => {

                history.push('/articles')
            })
    }

    const onChangeArticle = (e) => {
        console.log("event",e.target)
        const { name, value } = e.target;
        setUpdateArticle({
            ...updateArticle,
            [name]: value,
        });

        console.log(updateArticle)
    };

    const editArticle = (articleId) => {
        
        console.log(selectArtcile)
        axios.put(`http://localhost:5000/api/article/${articleId}/edit`, {...updateArticle, id: props.auth.currentUser._id })
            .then(data => {

                history.push('/articles')
            })
    }

    return (
        <>
            <div className="art1" style={{ width: '60%', height: '500px', margin: '0 auto' }}>
                <img style={{ height: '500px', width: '100%' }}
                    src={img}
                    alt=""
                />

                <h1>{title}</h1>
                <p>{content}</p>

                {props.auth.isLoggedIn ? <>

                    {props.auth.currentUser._id === selectArtcile.user ? <>

                        <Button className="float-right" variant="outline-warning" onClick={handleShow}>Delete</Button>
                        <Button className="mr-5 float-right" variant="outline-info" onClick={handleShowEdit}>EDit</Button>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure you want to delete this article</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => deleteArticle(articleId)}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal size="lg" show={showEdit} onHide={handleCloseEdit}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Article</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input type="text" name="title" size="80" defaultValue={selectArtcile.title} onChange={(e) => onChangeArticle(e)} /> <br/> <br/>
                                <textarea rows="8" cols="80" type="text" name="content" defaultValue={selectArtcile.content} onChange={(e) => onChangeArticle(e)} /> <br/>
                                <input type="text" size="80" name="img" defaultValue={selectArtcile.img} onChange={(e) => onChangeArticle(e)} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseEdit}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => editArticle(articleId)}>
                                    Edit
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </> : <>

                        </>} </> : <></>}

            </div>
        </>
    )
}
