

# [1.5.0](https://github.com/omrsfylmz/pool/compare/1.3.0...1.5.0) (2026-02-22)


### Features

* add iOS ActivityKit entitlement and remote notification background mode ([da85306](https://github.com/omrsfylmz/pool/commit/da85306b5484b62e0005a1b651800f5749226931))
* Enable new architecture by setting `newArchEnabled` to true. ([19a98b6](https://github.com/omrsfylmz/pool/commit/19a98b6f8bb079555489a68f74e6eba48cd96e86))
* Initialize Expo React Native project with native configurations for Android and iOS. ([469e5a6](https://github.com/omrsfylmz/pool/commit/469e5a6850d596fb422a83bb2c467937ccb725c5))
* Map 'utensils' icon to 'silverware-fork-knife' in food display components. ([44eb13b](https://github.com/omrsfylmz/pool/commit/44eb13b709254312019e78dd7eab024563e8e627))
* remove Live Activity support and related configurations ([46ff349](https://github.com/omrsfylmz/pool/commit/46ff34981e47d8f42528eaf09acfcc39e413877a))

# [1.3.0](https://github.com/omrsfylmz/pool/compare/1.2.0...1.3.0) (2026-02-16)


### Bug Fixes

* Add validation and explicit error for missing Supabase environment variables. ([d71ce54](https://github.com/omrsfylmz/pool/commit/d71ce54c213729e7c94e91ee816a1c2f20396960))
* Map legacy 'pizza-slice' icon to 'pizza' for MaterialCommunityIcons. ([b93cf65](https://github.com/omrsfylmz/pool/commit/b93cf651aaabf1b58489127924b5357fb3c56c64))


### Features

* Add `getFoodOptions` and `getVotesForPool` imports to winner screen. ([23d12d8](https://github.com/omrsfylmz/pool/commit/23d12d85e1ede25253cce01fa70aa8ff8183b930))
* Add `preview-simulator` EAS build profile for iOS simulator. ([18d90cf](https://github.com/omrsfylmz/pool/commit/18d90cf4db04f3e856fbe059ec12e4c651abcd94))
* Add a "Go to Live Results" button to the share pool screen. ([7c4aea3](https://github.com/omrsfylmz/pool/commit/7c4aea394a3f4c7d90250a1a3b88066b5fb8351d))
* add babel.config.js to configure Babel for Expo with the Reanimated plugin. ([c0d555d](https://github.com/omrsfylmz/pool/commit/c0d555d2bc4c30a19a14f21f37317337173d5b4c))
* Add i18n support for all notifications and refine daily lunch notification scheduling to be weekly and update on language change. ([fd58511](https://github.com/omrsfylmz/pool/commit/fd585119a690d5c2663982074cec6041655fbf34))
* Add initial website documentation pages including privacy, support, homepage, and global styling. ([9642e84](https://github.com/omrsfylmz/pool/commit/9642e8461afcaf55b9a0aff2e63d69a8d3afee0a))
* Add iOS deployment target and expo-notifications plugin. ([cfe2911](https://github.com/omrsfylmz/pool/commit/cfe291108895e38774ded6ab1d6f34ded0a1bf53))
* Add Live Activity support for pools, displaying countdowns on Dynamic Island and Lock Screen. ([6fa33f6](https://github.com/omrsfylmz/pool/commit/6fa33f6e103246cad14afe56d0921e4f3ba77ccf))
* Add new translation keys for connection timeout, empty past pools, and pool-related errors. ([a194067](https://github.com/omrsfylmz/pool/commit/a194067a6cd93fc9c6a6054856cc917d11eda741))
* Add validation to prevent duplicate food suggestions before adding new options. ([b333175](https://github.com/omrsfylmz/pool/commit/b333175b7f99351acb678c7a65f1a0d9209e1b04))
* display multiple active pools in a carousel on the dashboard, supported by a new API function to fetch all active pools. ([0911b83](https://github.com/omrsfylmz/pool/commit/0911b83b9d734b2d7cec47b98d6aead072ef8e8a))
* Enable users to delete their own previous suggestions with a confirmation dialog. ([495aea4](https://github.com/omrsfylmz/pool/commit/495aea4d55f3cdff2668e2cbdf84fbe0059367b9))
* Implement animated sorting of food options by vote count using `useMemo` and `react-native-reanimated`'s `LinearTransition`. ([2e7f7e7](https://github.com/omrsfylmz/pool/commit/2e7f7e7ea74a7f2eeca501e7a5e8c6885389c375))
* Implement cold start notification handling and update pool result deep link paths from `/winner` to `/results`. ([c8c00c6](https://github.com/omrsfylmz/pool/commit/c8c00c689e0f77b9b764dd760374cfa7ffa61b2a))
* Introduce Supabase and GitHub environment variables and update `.gitignore` to track the `.env` file. ([ba632d9](https://github.com/omrsfylmz/pool/commit/ba632d9c14ee4a2eea7007a56ef8c591f6585a7c))
* limit past polls displayed on dashboard to 3 ([d54fbbd](https://github.com/omrsfylmz/pool/commit/d54fbbd31a029d059cd40ea370c3ffc09637aab1))
* Persist Live Activity IDs using AsyncStorage, making service functions asynchronous, and implementing state restoration and cleanup across the app. ([c402799](https://github.com/omrsfylmz/pool/commit/c402799750defe60341f18a1e39399ad472d40fa))
* Replace old `react-logo` and `splash-icon` images with `splash-icon-new.png` across app configuration and UI components. ([7147dcd](https://github.com/omrsfylmz/pool/commit/7147dcd00bdca7faa43b6a21b58e7dee4d660c89))

# [1.2.0](https://github.com/omrsfylmz/pool/compare/1.1.0...1.2.0) (2026-02-11)


### Features

* Add GITHUB_TOKEN to environment variables and update .gitignore to exclude the .env file. ([305ac6c](https://github.com/omrsfylmz/pool/commit/305ac6cf8cb710a8b410131f6802adcc9796af7e))

# 1.1.0 (2026-02-11)


### Bug Fixes

* prevent duplicate navigation to the winner page when a pool ends by introducing a navigation flag. ([d16fb14](https://github.com/omrsfylmz/pool/commit/d16fb14795ede7e898033d2dcf5701ec85a4411d))


### Features

* Add 'delete' translation key to English and Turkish locales. ([1570b2d](https://github.com/omrsfylmz/pool/commit/1570b2d8b39004ae13711c9ac41d216105706e35))
* Add `earnedCount` and `totalCount` props to the `BadgesSection` component. ([eadedd5](https://github.com/omrsfylmz/pool/commit/eadedd5c22c0ee9219b6e1416ea011903adf44c5))
* Add ActivePoolCard to dashboard, displaying active voting pools with countdown and filtering active pools from the API. ([bde28a0](https://github.com/omrsfylmz/pool/commit/bde28a0e0bf4b99cfce82c61e774e9d25b02ab03))
* Add an 'All Badges' modal to the profile screen, displaying all available badges and user progress. ([c967515](https://github.com/omrsfylmz/pool/commit/c9675156cf3d347266058461ce8bd6cfa96ceab2))
* Add and integrate a Privacy Policy modal into the profile screen. ([7882e1c](https://github.com/omrsfylmz/pool/commit/7882e1ca3a755a6097bf5f89eda00ab7dc3ee508))
* Add Android package name and initial version code to app configuration. ([0e2c340](https://github.com/omrsfylmz/pool/commit/0e2c3404970b580187c06e59c36bab185d719d2e))
* Add decorative background food icons using FontAwesome5 and Dimensions. ([8bb03f6](https://github.com/omrsfylmz/pool/commit/8bb03f6b943352dd4ff9ca668c6b1151da1c7741))
* Add hero image to share pool and remove header from vote screen. ([076cc56](https://github.com/omrsfylmz/pool/commit/076cc56ac915ac46b3fdb648762fe30fed4e1451))
* Add icon property to vote option object. ([b709594](https://github.com/omrsfylmz/pool/commit/b709594178d47d5c5cd000d2ab3e99d670e401aa))
* add new voting UI strings and refactor the subtitle key to an object. ([3cab8cc](https://github.com/omrsfylmz/pool/commit/3cab8cc450a9fa7017dbf05fc7bb1b3ea94adba4))
* add password update modal component and integrate it into the profile screen's security settings. ([82a107a](https://github.com/omrsfylmz/pool/commit/82a107ab874ff7e601790a2b88668576bead2cb9))
* Add privacy policy content to i18n files and internationalize the PrivacyPolicyModal component. ([f86d7bf](https://github.com/omrsfylmz/pool/commit/f86d7bfa1a1a12c5def7b51f4c1abfa071227992))
* Add pull-to-refresh functionality to the profile screen. ([d60c5b0](https://github.com/omrsfylmz/pool/commit/d60c5b08b2db22f99968f84bc13f05c7fb9a5296))
* Adjust daily notification time and remove test notification function. ([a7e85b5](https://github.com/omrsfylmz/pool/commit/a7e85b5f878cebb51f8a3cd8dc700396dd9ef5dc))
* Adopt MaterialCommunityIcons, update existing icon names, and improve icon picker modal design. ([0ec683f](https://github.com/omrsfylmz/pool/commit/0ec683f2c8e1241c05db345731e6d1eab56ae650))
* Automatically add pool creator as a member and include creator avatar in ended pools list. ([bb9aba6](https://github.com/omrsfylmz/pool/commit/bb9aba6ca5dd5c5ed6cddf04c6eb426e3cb35010))
* Configure Jest for TypeScript testing and refactor `supabase.from` mocking in API tests. ([d96dee7](https://github.com/omrsfylmz/pool/commit/d96dee7ff9bbd0ebd59f741c44e3cd49f095cad1))
* display an empty state message in the badges section when no badges are earned. ([34dc53c](https://github.com/omrsfylmz/pool/commit/34dc53c203feaabb57740431e39a3004ff168ac7))
* Display participant avatars in past polls and fetch user-specific past pools. ([076902b](https://github.com/omrsfylmz/pool/commit/076902b287e8a52be31acd49baa345c4b57461f4))
* Display top 3 earned badges in the profile section by mapping badge IDs to display objects. ([79c60f8](https://github.com/omrsfylmz/pool/commit/79c60f888aeeef92551451a13938892b45253489))
* Dynamically load pool and profile data on the share pool page and update pool creation to navigate to it. ([fa00eb1](https://github.com/omrsfylmz/pool/commit/fa00eb1f976c7695a8650e0ed3cd3ce2e64fa68e))
* Enable dashboard navigation via VoteHeader avatar and NewSuggestionHeader back button. ([6b10aba](https://github.com/omrsfylmz/pool/commit/6b10abacbfd4e4b5acc322dc6419312b38480929))
* Enable joining pools via unique 6-character codes, including code generation, lookup, and a dedicated join UI. ([9b5e80c](https://github.com/omrsfylmz/pool/commit/9b5e80c08c2564ffd50ce87a12416140219283c8))
* Enhance `CreatePoolHeader` styling with a background, border, and centered title, and update Turkish translations to use "Oylama" instead of "Havuz" for pool-related terms. ([e626efa](https://github.com/omrsfylmz/pool/commit/e626efa3a2db222328cc091f157a7f17d7edb62e))
* Enhance authentication session management by handling refresh token errors and explicitly redirecting on sign-out. ([a6fcc81](https://github.com/omrsfylmz/pool/commit/a6fcc81048add5bf726f729a6ec8a71527b13db2))
* Enhance password update functionality with same password validation, specific error messages, and improved auth context handling. ([8e8e272](https://github.com/omrsfylmz/pool/commit/8e8e272256ac62ed019f537ec95b477e4be6a3ff))
* Fetch and display user avatars in pool results and profile, updating the avatar emoji utility to support direct emojis. ([b103104](https://github.com/omrsfylmz/pool/commit/b103104994287db31df1051de6279ca60dcbd097))
* Implement a floating "Add Your Idea" button and update various FontAwesome5 icons across UI components. ([eebe5e5](https://github.com/omrsfylmz/pool/commit/eebe5e524d02a954d7566ab85282256eac8449d2))
* Implement and automatically award the "Newcomer" badge upon user signup, and update badge display logic. ([62721ab](https://github.com/omrsfylmz/pool/commit/62721aba6d6bd0eb021a0c91fc10074be143f4da))
* implement animated splash screen with a bear-themed app icon and integrate it into the app's initial loading sequence. ([55db2c4](https://github.com/omrsfylmz/pool/commit/55db2c496e9034fd583231e09587481d25266afe))
* Implement authentication-based routing logic and define navigation screens within a new `InitialLayout` component. ([329dc12](https://github.com/omrsfylmz/pool/commit/329dc12ad4358472c2609d7f08f8dc3ef4732f85))
* Implement automated releases using `release-it` and conventional changelog. ([f8c90d7](https://github.com/omrsfylmz/pool/commit/f8c90d75b776f9c6ad3eadbae2d6cd4e1ee7e7cd))
* Implement dedicated login and signup screens. ([cee0520](https://github.com/omrsfylmz/pool/commit/cee0520f6e0bbab89890950951ae211c7fe8ea4b))
* Implement deep linking for sharing pools and reformat import statements in login and signup. ([fe10655](https://github.com/omrsfylmz/pool/commit/fe10655a236f24c51927ea3edfe840b24717658a))
* Implement EAS configuration, enhance voting flow with redirection to results, and update iOS app settings. ([2e761fc](https://github.com/omrsfylmz/pool/commit/2e761fca35f77354955564ff683d5be03275a1ca))
* Implement extensive internationalization across multiple screens and components, adding new translation keys for various UI elements and alerts. ([8ef556f](https://github.com/omrsfylmz/pool/commit/8ef556f9cc2e3ee24c61f89ac85d039e61cfc1d9))
* Implement i18n for animal identities and status messages, and display actual animal emojis in UI components. ([4ccfc5f](https://github.com/omrsfylmz/pool/commit/4ccfc5fff18de584335b7cb5abaf5075b8896011))
* Implement icon selection for food suggestions, update `FoodCard` to display chosen icons, and integrate the new `IconPickerModal`. ([1ad17c3](https://github.com/omrsfylmz/pool/commit/1ad17c3cd08a265a7723e8f1f96164e9fd79b9a8))
* Implement internationalization (i18n) across app screens and UI components, updating locale files for English and Turkish. ([215f456](https://github.com/omrsfylmz/pool/commit/215f4567285cc4679b42f7c80e3fcd6c40e5f482))
* Implement internationalization with a language selection modal and English/Turkish locales. ([8551256](https://github.com/omrsfylmz/pool/commit/8551256eac198316babbbbc2d54328cd4746d024))
* Implement join code display and copy functionality for pools, along with a new `pool_members` database table. ([44ea33c](https://github.com/omrsfylmz/pool/commit/44ea33cd3376cadb977505523a8de04952b157e5))
* Implement multi-step pool creation and avatar selection, including new UI components, API updates, and navigation improvements. ([05bd63b](https://github.com/omrsfylmz/pool/commit/05bd63b79b5ad6e015d0071af1be57d5623b24c9))
* Implement password update modal with i18n support and refine `CreatePoolHeader` layout. ([0c5253f](https://github.com/omrsfylmz/pool/commit/0c5253f35d2726d545a67ee76395f8d1e2f9a6b1))
* Implement past pools screen with detailed results API and dashboard navigation. ([00c0562](https://github.com/omrsfylmz/pool/commit/00c05621b478f34e1019e08c9341d0ec88b5329a))
* Implement poll expiration checks and add corresponding i18n messages for join and vote flows. ([eee9457](https://github.com/omrsfylmz/pool/commit/eee9457f297fc7e6f79f5a2ebc69e93e9aa5b18a))
* Implement pool reactivation, allowing users to clone options from past pools and pre-fill creation forms. ([ae7ba4f](https://github.com/omrsfylmz/pool/commit/ae7ba4f82dc47bba9f5042ac8fb25b16883a9350))
* implement pull-to-refresh functionality on the dashboard screen ([657e9d8](https://github.com/omrsfylmz/pool/commit/657e9d869090c913b412763b87a686aed6388fbc))
* Implement push notification functionality including daily reminders and a test trigger. ([f88f752](https://github.com/omrsfylmz/pool/commit/f88f7523b8836b486f974a1b08423f5516d37223))
* Implement push notifications for pool completion and lazy expiration, including token storage, notification routing, and a database schema update. ([5838e37](https://github.com/omrsfylmz/pool/commit/5838e379a9d6bfcf333609378e48867f42969542))
* Implement real-time voting with pool ending logic and winner display. ([8dce65a](https://github.com/omrsfylmz/pool/commit/8dce65a6cd3257548463518af8e4be08d6b17c48))
* Implement room joining functionality and enhance active pool detection to include joined rooms, with added unit tests. ([59d0268](https://github.com/omrsfylmz/pool/commit/59d02687f6344b16d9ea66ee4348416f1213e0df))
* Implement Supabase for authentication, real-time data, and core application services with initial schema and API. ([4aa35c3](https://github.com/omrsfylmz/pool/commit/4aa35c31a06539c07d97884a69cffd94d63e4037))
* Implement swipe-to-hide functionality for past polls using local storage. ([084b3e9](https://github.com/omrsfylmz/pool/commit/084b3e9c4137c333257c5d7d0204e89b569e922b))
* Implement swipeable reactivate and delete actions for past poll cards and add a "View All" option. ([bcbdab5](https://github.com/omrsfylmz/pool/commit/bcbdab512b26aabf081945f8f038fb1ec48dbaf9))
* Implement tap-to-copy functionality for the pool join code, adding a copy icon and internationalized success and hint messages. ([8dc49da](https://github.com/omrsfylmz/pool/commit/8dc49dab2611ba2bebe215a46bd5d88c535f2988))
* Implement user profile editing and account deletion functionality with supporting UI, i18n, and backend logic. ([57cd837](https://github.com/omrsfylmz/pool/commit/57cd837c660a125d0063b607d7635b798455a446))
* Improve keyboard handling in create-pool, new-suggestion, and profile edit modal components. ([39aca89](https://github.com/omrsfylmz/pool/commit/39aca892a9d60cbb525b0a1f80adc2497ec24d63))
* Integrate authentication context for user redirects, loading indicators, and dynamic profile display. ([44477fb](https://github.com/omrsfylmz/pool/commit/44477fb9e888bf4aaf51b8707c0196d70dcdcdaa))
* Integrate native sharing for pools and make the 'Add Your First Option' card tappable, replacing the QR code area. ([8718285](https://github.com/omrsfylmz/pool/commit/87182856f078437ee837a5dc4bc1fb8fa646516a))
* introduce and display user achievement medals with new API functions and UI components ([0dd82f5](https://github.com/omrsfylmz/pool/commit/0dd82f52d52aaab401f80918b3485b6bc3caf1ae))
* Introduce food medal system with `MedalDisplay` component and updated API to calculate pool winners and user medals. ([d377229](https://github.com/omrsfylmz/pool/commit/d377229ee179d3a8a5c0bc6d8c26421841071a07))
* Introduce real-time food option updates on the voting screen using new generic and specific subscription hooks. ([436a2a3](https://github.com/omrsfylmz/pool/commit/436a2a304951209b6fbea8a35e0cf30f61d4b92f))
* Introduce tab navigation and update authentication redirects to use the new tab layout. ([e1145f5](https://github.com/omrsfylmz/pool/commit/e1145f58b87156cda6927e2e2f495c3d7d4bed02))
* Personalize the dashboard welcome message by passing the user's name to the header component and updating i18n keys to support name placeholders. ([4fd4aa3](https://github.com/omrsfylmz/pool/commit/4fd4aa30e710ddcdc915a897022e54c598c92af5))
* Pre-fill pool creation form with initial title, description, and voting duration when reactivating a pool. ([4614466](https://github.com/omrsfylmz/pool/commit/46144667c2da526250a696a1ae67809aa1bf6479))
* Redesign winner and results breakdown UI with voter avatars, vote progress, and tie-breaker information, while passing the pool ID to the breakdown screen. ([ac908f4](https://github.com/omrsfylmz/pool/commit/ac908f44fb1d54d7534529bd6c44d7a3d3db6492))
* Refactor DurationSelector to be a controlled component, support null duration, and add validation for duration selection in pool creation. ([98bbf3c](https://github.com/omrsfylmz/pool/commit/98bbf3cf8fb14f69ec5dd6347fa6f308e917b609))
* Remove `ChartCard` component and related data, clean up debug logs, and adjust profile layout. ([98db2f7](https://github.com/omrsfylmz/pool/commit/98db2f7e0ffa27ec0e944afb9165d7ce7b56505c))
* Remove social login and signup options, simplifying the initial login content. ([5da6e6b](https://github.com/omrsfylmz/pool/commit/5da6e6bebfb35b55d9652a7e6133933b39ae0bef))
* Rename application to FoodPool and update its slug. ([4d54a56](https://github.com/omrsfylmz/pool/commit/4d54a568c2097fa855b3bc0aa853db57c21419d6))
* Replace emoji icons with FontAwesome5 icons for vote options, adding dynamic coloring and a new circular background style. ([96e15f5](https://github.com/omrsfylmz/pool/commit/96e15f53ff5f5b3ff95e4888d39fc042b05aa8f2))
* replace food image display with a FontAwesome5 icon and add new icon styling to FoodCard. ([fd6db65](https://github.com/omrsfylmz/pool/commit/fd6db650d858375214292ef88f0733afc289bcb4))
* Replace result card image thumbnails with FontAwesome5 icons and dynamically color progress bars by popularity. ([c778729](https://github.com/omrsfylmz/pool/commit/c77872900f5a3f5f7d0206e53fb1baf6814f0c3a))
* Replace the programmatic splash screen icon with a new image asset and refine animation timings. ([efba0bb](https://github.com/omrsfylmz/pool/commit/efba0bba9ee5bdebe43e098414090bd2c2aae366))
* Replaced "Havuz" with "Oylama" in Turkish translations for voting-related terms. ([7483524](https://github.com/omrsfylmz/pool/commit/7483524880f90b3d0248e14832f5e9e957f24b0a))
* Revamp vote screen i18n strings and add a loading overlay for post-vote navigation. ([d3628bd](https://github.com/omrsfylmz/pool/commit/d3628bdebf5067f8a4fa5471ea7770ae261f33b8))
* Schedule pool completion notifications and prevent duplicate daily notifications. ([a0e1381](https://github.com/omrsfylmz/pool/commit/a0e13813a7d44e239f7df7d29d9d442a15e68d58))
* Standardize navigation icons, refactor the "Add Your First Option" UI, and hide default stack headers for improved consistency. ([c2150f9](https://github.com/omrsfylmz/pool/commit/c2150f903a91989728e8ebb4a4681e7e5ae7eff4))
* Use `router.replace` for navigation to the vote screen and prevent duplicate food options from realtime updates. ([4be0268](https://github.com/omrsfylmz/pool/commit/4be026840a10e8629e8a226a66754b8b8c3fc27a))