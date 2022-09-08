import {ActivityIndicator, Alert, Button, Image, Platform, ScrollView, StyleSheet, TextInput, View} from "react-native";
import {useState} from "react";
import * as ImagePicker from 'expo-image-picker';
import {useNhostClient} from "@nhost/react";
import {useNavigation} from "@react-navigation/core";

const CREATE_PIN_MUTATION = `
mutation MyMutation ($image: String!, $title: String) {
  insert_pins(objects: {image: $image, title: $title}) {
    returning {
      user_id
      title
      image
      id
      created_at
    }
  }
}
`;


const CreatePinScreen = () => {

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const nhost = useNhostClient();
    const navigation = useNavigation();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.uri);
        }
    };

    const uploadFile = async () => {
        setIsLoading(true);
        if (!imageUri) return {
            error: {
                message: 'No image selected!'
            }
        };

        const parts = imageUri.split('/');
        const name = parts[parts.length - 1];

        const nameParts = name.split('.');
        const extensions = nameParts[nameParts.length - 1];

        const uri = Platform.OS === 'ios' ? imageUri.replace('file://', "") : imageUri;

        return await nhost.storage.upload({
            file: {
                name,
                type: `image/${extensions}`,
                uri,
            }
        });
    }

    const onSubmit = async () => {

       const uploadResult =  await uploadFile();

       if (uploadResult.error) {
           Alert.alert('Error uploading image', uploadResult.error.message);
           return;
       }

       const result = await nhost.graphql.request(CREATE_PIN_MUTATION, {
           title,
           image: uploadResult.fileMetadata.id,
       });

       if (result.error) {
           Alert.alert('Error creating the post');
           setIsLoading(false);
       } else {
           setIsLoading(false);
           navigation.goBack();
       }
        setImageUri(null);
        setTitle('');
        setIsLoading(false);
    }

    return (
        <ScrollView style={{flex: 1}}>
            {isLoading && <ActivityIndicator />}
            <View style={styles.root}>
            <Button title="Pick an image from camera roll" onPress={pickImage}/>
                {imageUri && <>
                <Image source={{uri: imageUri}} style={styles.image}/>
                <TextInput
                    placeholder={'Title...'}
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
                <Button
                    title={'Submit Pin'}
                    onPress={onSubmit}
                    disabled={isLoading}
                />
            </>
                }
         </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gainsboro',
        padding: 5,
        width: '100%',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        marginVertical: 10,
        borderRadius: 5,
    },
})

export default CreatePinScreen;