import React, { Fragment, useRef, useEffect, useState } from 'react';
import {
  Unsubscribe,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import useStore, { Chat } from '@/store';
import { command } from '@/utils/constants';
import { db } from '@/firebase';
import Prompt from '@/components/prompt';
import { Notification, Help } from '@/components/ui';

const ChatBox: React.FC = () => {
  const initial = useStore((state) => state.initial);
  const start = useStore((state) => state.start);
  const uid = useStore((state) => state.uid);
  const input = useStore((state) => state.input);
  const chat = useStore((state) => state.chat);
  const roomId = useStore((state) => state.roomId);
  const setChat = useStore((state) => state.setChat);
  const clearInput = useStore((state) => state.clearInput);
  const addInput = useStore((state) => state.addInput);
  const addChar = useStore((state) => state.addChar);
  const deleteChar = useStore((state) => state.deleteChar);
  const setRoomId = useStore((state) => state.setRoomId);
  const unsubRoomRef = useRef<Unsubscribe>();
  const unsubRoomChatRef = useRef<Unsubscribe>();
  const [active, setActive] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [cursor, setCursor] = useState<boolean>(true);

  const search = async () => {
    const roomsRef = collection(db, 'rooms');

    const joinRoom = async () => {
      const roomsColSnapshot = await getDocs(
        query(roomsRef, orderBy('timestamp'), where('available', '==', true)),
      );

      if (roomsColSnapshot.empty) {
        return false;
      }

      const roomId = roomsColSnapshot.docs[0].id;

      setRoomId(roomId);

      await updateDoc(doc(roomsRef, roomId), {
        available: false,
      });

      unsubRoomRef.current = onSnapshot(doc(roomsRef, roomId), async (doc) => {
        const room = doc.data();
      });

      unsubRoomChatRef.current = onSnapshot(
        query(collection(roomsRef, roomId, 'chat'), orderBy('timestamp')),
        async (snapshot) =>
          setChat(snapshot.docs.map((doc) => doc.data() as Chat)),
      );

      setSearching(false);
      setActive(true);
      clearInput();
      setCursor(true);

      return true;
    };

    const createRoom = async () => {
      await setDoc(doc(roomsRef, uid), {
        active: true,
        available: true,
        timestamp: serverTimestamp(),
      });

      setRoomId(uid);

      unsubRoomRef.current = onSnapshot(doc(roomsRef, uid), async (doc) => {
        const room = doc.data();

        if (!room!.available) {
          unsubRoomChatRef.current = onSnapshot(
            query(collection(roomsRef, uid, 'chat'), orderBy('timestamp')),
            async (snapshot) =>
              setChat(snapshot.docs.map((doc) => doc.data() as Chat)),
          );

          setSearching(false);
          setActive(true);
          clearInput();
          setCursor(true);
        }
      });
    };

    setSearching(true);
    setCursor(false);

    const suc = await joinRoom();

    if (suc) {
      return;
    }

    await createRoom();
  };

  const stopSearch = async () => {
    const roomsRef = collection(db, 'rooms');

    if (roomId) {
      unsubRoomRef.current && unsubRoomRef.current();
      unsubRoomChatRef.current && unsubRoomChatRef.current();

      await deleteDoc(doc(roomsRef, roomId));
    }

    setSearching(false);
    clearInput();
    setCursor(true);
  };

  const sendChat = async () => {
    const roomsRef = collection(db, 'rooms');

    await addDoc(collection(roomsRef, roomId, 'chat'), {
      uid: uid,
      message: input,
      timestamp: serverTimestamp(),
    });
  };

  const parseInput = (input: string) => {
    if (input === command.search) return search();

    if (active) {
      sendChat();
    } else {
      addInput();
    }
    clearInput();
  };

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      if (searching && e.ctrlKey && e.key.toLowerCase() === 'z')
        return stopSearch();

      const c = e.key;

      switch (c) {
        case 'Enter':
          parseInput(input);
          break;
        case 'Backspace':
          deleteChar();
          break;
        case ' ':
          addChar(' ');
          break;
        default:
          if (c.length === 1) {
            addChar(e.key);
          }
      }
    };
    window.addEventListener('keydown', keydownEvents);

    return () => {
      window.removeEventListener('keydown', keydownEvents);
    };
  }, [input, searching, roomId]);

  useEffect(() => {
    if (active && initial) start();
  }, [active]);

  return (
    <div className="flex-grow p-4 mt-4 border-solid border-[0.025rem] border-white rounded">
      {initial && (
        <Notification
          className="mb-2"
          text="type 'cherm help' to display available commands."
        />
      )}
      {uid && (
        <>
          {active && (
            <Notification
              className="mb-2"
              text="you are now chatting with a random stranger."
            />
          )}
          {chat.map((chat, i) => {
            const key: React.Key = chat.timestamp
              ? `chat-${chat.timestamp.toDate().toString()}`
              : `chat-${i}`;

            return (
              <React.Fragment key={key}>
                {((chat.uid === uid && chat.message === 'cherm help') ||
                  chat.message !== 'cherm help') && (
                  <div className="mb-2">
                    <p className="break-all">
                      <span className="font-bold">
                        {active
                          ? chat.uid === uid
                            ? 'you : '
                            : 'stranger : '
                          : '[me@cherm] → '}
                      </span>
                      {chat.message}
                    </p>
                  </div>
                )}
                {chat.message === 'cherm help' && chat.uid === uid && (
                  <Help parentKey={key} />
                )}
              </React.Fragment>
            );
          })}
          <Prompt cursor={cursor} />
          {searching && (
            <Notification
              className="mt-2"
              subClassName="three-dot-loader"
              text="searching for a stranger..."
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
