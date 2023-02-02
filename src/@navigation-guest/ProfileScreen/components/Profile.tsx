/* eslint-disable react-native/no-inline-styles */
import Axios from 'axios';
import React, {FC, memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {TUser} from '../../../../slice/userSlice';
import {Gist} from '../../../components-shared/Gist';
import {Header} from '../../../components-shared/Header';
import {TGist} from '../../../components-shared/types';

export interface Props {
  navigation: any;
}

export const Profile: FC<Props> = memo(({navigation}) => {
  const {user} = useSelector((state: TUser) => state);
  const username = user.username;
  const [gistList, setGistList] = useState<Array<TGist>>([]);
  const [userData, setUserData] = useState<{
    username: string;
    avatar_url: string;
    about: string;
    tags: Array<string>;
    github_url: string | null;
    total_gists: number;
    following: Array<{username: string; avatar_url: string}>;
    followers: Array<{username: string; avatar_url: string}>;
    isRegistered: boolean;
    registrationNumber: number | null;
    sponsor?: {avatar_url: string; username: string};
  }>();

  useEffect(() => {
    const getGist = async () => {
      const {data: gists} = await Axios.get(
        `/users/${username}/gists?page_size=5&page=0`,
        {
          baseURL: 'https://cosmocode-test.herokuapp.com',
          headers: {
            apiKey:
              'vfpfqjcrk1TJD6tdzbcg_JHT1mnq9rdv4pdzzrf4qmt8QFR-vtc_muhwke8qep-ymt5cuw.ARX',
          },
        },
      );
      setGistList(gists);
    };
    const getUser = async () => {
      const {data: user} = await Axios.get(`/users/${username}`, {
        baseURL: 'https://cosmocode-test.herokuapp.com',
        headers: {
          apiKey:
            'vfpfqjcrk1TJD6tdzbcg_JHT1mnq9rdv4pdzzrf4qmt8QFR-vtc_muhwke8qep-ymt5cuw.ARX',
        },
      });
      setUserData(user);
    };

    getGist();
    getUser();
  }, [username]);

  const onPressNavigate = (tab: string, user: any) => {
    navigation.navigate('DeveloperInfo', {tab, user});
  };

  return (
    <>
      <Header title="Profile" firstPage={true} />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Image
            style={{height: 100, width: 100, margin: 10, borderRadius: 100}}
            source={{uri: user?.avatar_url}}
          />
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'flex-end',
              minWidth: 250,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {username}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                paddingVertical: 15,
              }}>
              <View style={styles.followers}>
                <Text style={styles.genericText}>Post</Text>
                <Text style={styles.publicNumber}>{userData?.total_gists}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onPressNavigate('followers', user)}
                style={styles.followers}>
                <Text style={styles.genericText}>Followers</Text>
                <Text style={styles.publicNumber}>
                  {userData?.followers.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPressNavigate('followings', user)}
                style={styles.followers}>
                <Text style={styles.genericText}>Seguiti</Text>
                <Text style={styles.publicNumber}>
                  {userData?.following.length}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {userData && userData.total_gists <= 0 ? (
          <Text
            style={{
              width: '100%',
              fontSize: 15,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginTop: 25,
            }}>
            Non ci sono post :c
          </Text>
        ) : (
          <View
            style={{
              backgroundColor: 'black',
              marginTop: 40,
              marginHorizontal: 5,
            }}>
            {gistList.map((gist: TGist, index) => {
              return <Gist gist={gist} userInfo={false} key={index} />;
            })}
          </View>
        )}
      </ScrollView>
    </>
  );
});

const styles = StyleSheet.create({
  gistContainer: {
    backgroundColor: '#1b2123',
    paddingHorizontal: 15,
    paddingVertical: 5,
    position: 'relative',
    borderRadius: 10,
    boxShadow: '-1 6 10 1 #00000042',
    marginBottom: 40,
  },
  followers: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: 'hidden',
  },
  publicNumber: {
    fontSize: 15,
    color: 'white',
  },
  genericText: {
    fontSize: 15,
    color: 'white',
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 3,
    color: '#a0b3d7',
  },
  fileNameContainer: {
    alignItems: 'flex-end',
  },
  fileName: {
    opacity: 0.5,
  },
  username: {
    fontSize: 20,
    marginLeft: 20,
    color: '#a0b3d7',
  },
});