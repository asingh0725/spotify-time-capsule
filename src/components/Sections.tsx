import { Flex, View, Image } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export function PageFooter() {
  return (
    <Flex
      direction='row'
      justifyContent='center'
      alignItems='center'
      alignContent='center'
      wrap='nowrap'
    >
      <View height='2rem'></View>
      <View height='4rem'>
        <Image
          alt='Spotify Capsule Logo'
          src='../favicon.ico'
          // objectFit="initial"
          backgroundColor='initial'
          height='100%'
          width='100%'
          opacity='100%'
        />
      </View>
    </Flex>
  );
}
