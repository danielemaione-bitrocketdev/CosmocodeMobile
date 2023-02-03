/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {memo} from 'react';
import {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Linking,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Header} from '../../../components-shared/Header';
import {TGist} from '../../../components-shared/types';
import {Gist} from '../../../components-shared/Gist';
import {useSelector} from 'react-redux';
import {TLogin} from '../../../../slice/loginSlice';
import {FlatList} from 'react-native';

export const HomeScreen = memo(() => {
  const [gistList, setGistList] = useState<Array<TGist>>([]);
  const {login} = useSelector((state: TLogin) => state);
  const [value, setValue] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListEnd, setIsListEnd] = useState<boolean>(false);

  const fetchGists = async () => {
    try {
      await axios
        .get(
          `https://cosmocode-test.herokuapp.com/gists/feed?page_size=2&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${login.access_token}`,
              apiKey:
                'vfpfqjcrk1TJD6tdzbcg_JHT1mnq9rdv4pdzzrf4qmt8QFR-vtc_muhwke8qep-ymt5cuw.ARX',
            },
          },
        )
        .then(res => {
          setGistList([...gistList, ...res.data]);
          setIsListEnd(false);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={{marginVertical: 16, alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#aaaaaa" />
      </View>
    ) : null;
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setIsLoading(true);
  };

  const loadMoreItem = () => {
    !isLoading && !isListEnd && setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchGists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <>
      <Header title="Home" firstPage={true} />
      <View style={{backgroundColor: 'black'}}>
        {gistList.length > 0 ? (
          <FlatList
            nestedScrollEnabled
            data={gistList}
            renderItem={gist => {
              return <Gist gist={gist.item} />;
            }}
            ListHeaderComponent={() => {
              return (
                <>
                  <View style={styles.outer}>
                    <Text style={styles.pageTitle}>
                      Connettiti con sviluppatori e aziende tech di tutto il
                      mondo.
                    </Text>
                    <Text style={styles.description}>
                      Condividi e scopri in tempo reale a quali attività stanno
                      lavorando professionisti e realtà IT, ovunque nel mondo.
                    </Text>
                  </View>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={styles.subtitle}>MADE WITH ♥️ BY</Text>
                    <Text
                      onPress={() =>
                        Linking.openURL('https://www.bitrocket.dev')
                      }
                      style={styles.link}>
                      BITROCKET.DEV
                    </Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor="white"
                    placeholder="Cerca un post"
                    onChangeText={setValue}
                    value={value}
                  />
                </>
              );
            }}
            ListFooterComponent={renderLoader}
            refreshing={isListEnd}
            onRefresh={handleRefresh}
            onEndReached={loadMoreItem}
            onEndReachedThreshold={0.2}
            keyExtractor={(gist: any) => gist.index}
          />
        ) : (
          <View style={{height: '100%'}}>
            <View style={styles.outer}>
              <Text style={styles.pageTitle}>
                Connettiti con sviluppatori e aziende tech di tutto il mondo.
              </Text>
              <Text style={styles.description}>
                Condividi e scopri in tempo reale a quali attività stanno
                lavorando professionisti e realtà IT, ovunque nel mondo.
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={styles.subtitle}>MADE WITH ♥️ BY</Text>
              <Text
                onPress={() => Linking.openURL('https://www.bitrocket.dev')}
                style={styles.link}>
                BITROCKET.DEV
              </Text>
            </View>
            <Gist />
          </View>
        )}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  outer: {
    textAlign: 'center',
    paddingTop: 70,
  },
  pageTitle: {
    fontSize: 38,
    marginBottom: 0,
    color: 'white',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    paddingTop: 20,
    color: '#a0b3d7',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    paddingVertical: 10,
    color: '#a0b3d7',
    textAlign: 'center',
  },
  link: {
    fontSize: 10,
    paddingVertical: 10,
    paddingHorizontal: 2,
    color: 'rgb(17, 236, 229)',
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    width: 250,
    borderWidth: 1,
    borderColor: 'rgb(17, 236, 229)',
    padding: 10,
    color: 'white',
    background: 'none',
    alignSelf: 'center',
  },
});
