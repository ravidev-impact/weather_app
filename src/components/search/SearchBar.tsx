import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
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

  const handleFocus = (focused: boolean) => {
    setIsFocused(focused);
    onFocusChange?.(focused);
  };

  const renderSuggestion = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}>
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
        <Icon name="search" size={20} color="#fff" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={value}
          onChangeText={handleTextChange}
          onSubmitEditing={onSubmit}
          onFocus={() => handleFocus(true)}
          onBlur={() => {
            setTimeout(() => handleFocus(false), 200);
          }}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Icon name="close-circle" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {isFocused && searchHistory.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Recent Searches</Text>
          <View style={styles.suggestionsListContainer}>
            <FlatList
              data={searchHistory}
              renderItem={renderSuggestion}
              keyExtractor={item => item}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              bounces={true}
              nestedScrollEnabled={true}
              scrollEnabled={true}
            />
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchContainerError: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 8,
    maxHeight: 200,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  suggestionsListContainer: {
    height: 150,
  },
  suggestionsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SearchBar;
