export type RootStackParamList = {
  SplashScreen: undefined;
  StartupScreen: undefined;
  SignInScreen: undefined;
  AppScreen: undefined;
  DeliveryScreen: { manifestoId: string };
  CollectionScreen: { manifestoId: string };
  DispatchScreen: { manifestoId: string };
  WithDrawalScreen: { manifestoId: string };
  TransferScreen: { manifestoId: string };
};
