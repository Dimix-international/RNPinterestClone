import {ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import MasonryList from "../components/MasonryList";
import pins from "../assets/data/pins";
import {Entypo, Feather} from "@expo/vector-icons";
import {useNhostClient, useSignOut, useUserId} from "@nhost/react";
import {useEffect, useState} from "react";

const GET_USER_QUERY = `
query MyQuery($id: uuid!) {
  user(id: $id) {
    id
    avatarUrl
    displayName
    pins {
      id
      image
      title
      created_at
    }
  }
}
`;

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const nhost = useNhostClient();
  const { signOut } = useSignOut();

  const userId = useUserId();

  const fetchUserData = async () => {
    setLoading(true);
    const result = await nhost.graphql.request(GET_USER_QUERY, {id: userId});

    if(result.error) {
      Alert.alert('Error fetching the user');
    } else{
      setUser(result.data.user);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUserData();
  },[]);

  if(!user) {
    return <ActivityIndicator />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>

        <View style={styles.icons}>
          <Pressable onPress={signOut}><Feather
              name={'share'}
              size={24}
              color={'black'}
              style={styles.icon}
          /></Pressable>
          <Entypo
              name={'dots-three-horizontal'}
              size={24}
              color={'black'}
              style={styles.icon}
          />
        </View>

        <Image
          source={{uri: user.avatarUrl}}
          style={styles.image}
      />
        <Text style={styles.title}>{user.displayName}</Text>
        <Text style={styles.subtitle}>123 Followers | 534 Following</Text>
      </View>

      <MasonryList pins={user.pins} onRefresh={fetchUserData} refreshing={loading}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  image: {
    width: 200,
    aspectRatio: 1,
    borderRadius: 200,
  },
  subtitle: {
    color: '#181818',
    fontWeight: '600',
  },
  icons: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
  },
  icon: {
    paddingHorizontal: 10,
  }
});
