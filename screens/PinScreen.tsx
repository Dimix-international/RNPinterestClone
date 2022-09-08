import {Text, StyleSheet, View, Image, Pressable, ScrollView, Alert} from "react-native";
import {useEffect, useState} from "react";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useNhostClient} from "@nhost/react";
import RemoteImage from "../components/RemoteImage";

const GET_PIN_QUERY = `
        query MyQuery ($id: uuid!) {
             pins_by_pk(id: $id) {
                title
                created_at
                id
                image
                user {
                    avatarUrl
                    id
                    displayName
                }
              }
             }
        `;

const PinScreen = () => {
    const [pin, setPin] = useState<any>(null);

    const nhost = useNhostClient();

    const navigation = useNavigation();
    const route = useRoute();
    // @ts-ignore
    const pinId = route.params.id;

    const goBack = () => {
        navigation.goBack();
    };

    const insets = useSafeAreaInsets();

    const fetchPin = async (id:string) => {
        const response = await nhost.graphql.request(GET_PIN_QUERY, {id});
        if (response.error) {
            Alert.alert('Error fetching the pin');
        } else {
            setPin(response.data.pins_by_pk);
        }
    }

    useEffect(() => {
        fetchPin(pinId);
    },[pinId]);


    if(!pin) {
        return <Text>Pin not found</Text>
    }
    return (
        <SafeAreaView style={{backgroundColor: 'black'}}>
            <StatusBar style={'light'} />
            <ScrollView style={styles.root}>
                <View style={styles.root}>
                    <RemoteImage fileId={pin.image} />
                <Text style={styles.title}>{pin.title}</Text>
            </View>
            </ScrollView>
            <Pressable
                style={[styles.btnBack, {
                    top: insets.top + 20
                }]}
                onPress={goBack}
            >
                <Ionicons name={'chevron-back'} size={35} color={'white'}/>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        height: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    title: {
        margin: 10,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 35,
    },
    btnBack: {
        position: 'absolute',
        left: 10,
    },
});

export default PinScreen;