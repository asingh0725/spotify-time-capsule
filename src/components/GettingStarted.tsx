import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import { Flex, Button } from "@aws-amplify/ui-react";

const modalStyles: Modal.Styles = {
  content: {
    width: "600px",
    height: "500px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "5rem",
    transform: "translate(-50%, -50%)",
  },
};

const GettingStarted: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const wasOpened = localStorage.getItem("pop_status");
    if (!wasOpened) {
      setVisible(false);
      localStorage.setItem("pop_status", "1");
    }
  }, []);

  const openModal = useCallback(() => setVisible(true), []);
  const closeModal = useCallback(() => setVisible(false), []);

  if (!visible) {
    return (
      <Flex justifyContent="center" alignItems="center" padding="2rem">
        <Button variation="primary" onClick={openModal}>
          GETTING STARTED
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Button variation="primary" onClick={openModal}>
        GETTING STARTED
      </Button>

      <Modal
        isOpen={visible}
        style={modalStyles}
        onRequestClose={closeModal}
        contentLabel="Getting Started"
      >
        <div>
          <h2>Spotify Capsules</h2>

          <p>
            Welcome! This app lets you generate Time Capsule playlists or
            genre-based recommendations using your Spotify listening history.
          </p>

          <h3>Instructions</h3>
          <ul>
            <li>Select the “Time Capsule” or “Genre” tab</li>
            <li>Log in with your Spotify account</li>
            <li>Fill out the fields</li>
            <li>Create your playlist!</li>
          </ul>

          <Button variation="primary" onClick={closeModal} marginTop="1rem">
            CLOSE
          </Button>
        </div>
      </Modal>
    </Flex>
  );
};

export default GettingStarted;
