import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function myRequestsScreen() {
    const requests = [
        {
            "name": "John Doe",
            "date": "January 1, 2000"
        },
        {
            "name": "Jane Smith",
            "date": "February 14, 1999"
        },
        {
            "name": "Michael Brown",
            "date": "March 3, 2010"
        },
        {
            "name": "Emily Davis",
            "date": "April 12, 2002"
        },
        {
            "name": "James Wilson",
            "date": "May 25, 2005"
        },
        {
            "name": "Linda Johnson",
            "date": "June 7, 1997"
        },
        {
            "name": "Robert Lee",
            "date": "July 19, 2011"
        },
        {
            "name": "Patricia Clark",
            "date": "August 8, 1996"
        },
        {
            "name": "David Thompson",
            "date": "September 29, 2003"
        },
        {
            "name": "Sarah Lewis",
            "date": "October 16, 1998"
        },
        {
            "name": "Christopher Young",
            "date": "November 11, 2004"
        },
        {
            "name": "Karen King",
            "date": "December 31, 2012"
        },
        {
            "name": "Brian White",
            "date": "January 10, 2001"
        },
        {
            "name": "Nancy Martinez",
            "date": "February 22, 2006"
        },
        {
            "name": "Daniel Green",
            "date": "March 15, 2009"
        },
        {
            "name": "Elizabeth Hall",
            "date": "April 25, 1995"
        },
        {
            "name": "Richard Allen",
            "date": "May 5, 2007"
        },
        {
            "name": "Jessica Scott",
            "date": "June 30, 1994"
        },
        {
            "name": "Thomas Adams",
            "date": "July 14, 2014"
        },
        {
            "name": "Margaret Baker",
            "date": "August 20, 2016"
        }
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={({ item }) =>
                    <View>
                        <Text style={styles.listName}>{item.name}</Text>
                        <Text style={styles.listDate}>{item.date}</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listDate: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    listName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
