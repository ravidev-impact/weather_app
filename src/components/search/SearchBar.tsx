import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  error?: string;
  onFocusChange?: (focused: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  error,
  onFocusChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const {searchHistory} = useSelector(
    (state: RootState) => state.searchHistory,
  );

  const handleSelectSuggestion = (suggestion: string) => {
    onChangeText(suggestion);
    onSubmit();
    setIsFocused(false);
    onFocusChange?.(false);
  };

  const handleTextChange = (text: string) => {
    // Only allow letters, spaces, and hyphens
    const validText = text.replace(/[^a-zA-Z\s-]/g, '');
    onChangeText(validText);
  };

  const handleFocus = (_e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      onFocusChange?.(false);
    }, 200);
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const handleClear = () => {
    onChangeText('');
  };

  const renderSuggestion = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
      testID={`suggestion-item-${item}`}>
      <Icon
        name="time-outline"
        size={20}
        color="#fff"
        style={styles.suggestionIcon}
      />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={[styles.searchContainer, error && styles.searchContainerError]}>
        <TextInput
          placeholder="Search city..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="words"
          testID="search-input"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
          testID="search-button">
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
        {value !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            testID="clear-button">
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {isFocused && searchHistory.length > 0 && (
        <View
          style={styles.suggestionsContainer}
          testID="suggestions-container">
          <Text style={styles.suggestionsTitle}>Recent Searches</Text>
          <View style={styles.suggestionsListContainer}>
            <ScrollView
              style={styles.suggestionsScroll}
              keyboardShouldPersistTaps="handled"
              testID="suggestions-scroll">
              <FlatList
                data={searchHistory}
                renderItem={renderSuggestion}
                keyExtractor={item => item}
              />
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    paddingHorizontal: 24,
    height: 55,
    justifyContent: 'space-between',
  },
  searchContainerError: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    paddingRight: 10,
    fontWeight: '400',
  },
  searchButton: {
    padding: 5,
  },
  clearButton: {
    padding: 5,
    marginRight: 8,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 85,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    padding: 12,
    maxHeight: 200,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  suggestionsListContainer: {
    height: 150,
  },
  suggestionsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 16,
  },
  suggestionsScroll: {
    height: 150,
  },
});

export default SearchBar;
