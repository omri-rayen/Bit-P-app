import { StyleSheet, Text, View } from 'react-native';
import System from '../components/system';
import Device from '../components/device';

export default function HomeScreen () {
    return (
        <View style={styles.container}>
            <System />
            <Device />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});