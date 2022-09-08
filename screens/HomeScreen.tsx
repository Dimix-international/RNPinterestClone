import { RootTabScreenProps } from '../types';
import MasonryList from "../components/MasonryList";
import {useEffect, useState} from "react";
import {useNhostClient} from "@nhost/react";
import {Alert} from "react-native";

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {

  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const nhost = useNhostClient();

  const fetchPins = async () => {
    setLoading(true);
    const response = await nhost.graphql.request(` 
      query MyQuery {
        pins {
          created_at
          id
          image
          title
          user_id
      }
    }
      `);

    if (response.error) {
      Alert.alert('Error fetching pins');
    } else {
      setPins(response.data.pins);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPins()

  }, []);



  return (
      <MasonryList
          pins={pins}
          onRefresh={fetchPins}
          refreshing={loading}
      />
  );
}

