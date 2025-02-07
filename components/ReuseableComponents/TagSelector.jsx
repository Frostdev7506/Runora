import React, { useState, useCallback, memo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Chip,
  Surface,
} from 'react-native-paper';
import useStore from '../../store/store';

const EMOJI_LIST = [
  '🍔', '🚗', '🛍️', '🛒', '🎮', '💊', '💡', '📝', '🏠', '💼',
  '✈️', '🎓', '🎬', '📱', '🎵', '🎨', '🏋️', '🎁', '💰', '🎯'
];

const TagSelector = memo(({ selectedTags, onTagsChange }) => {
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [slideAnim] = useState(new Animated.Value(0));

  const addTag = useStore(state => state.addTag);
  const allTags = useStore(state => state.tags);

  useEffect(() => {
    useStore.getState().getTags(); // initial fetch
  }, []);

  const toggleNewTagForm = useCallback(() => {
    setShowNewTagForm(prev => !prev);
    setShowEmojiSelector(false);
    Animated.timing(slideAnim, {
      toValue: showNewTagForm ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showNewTagForm, slideAnim]);

  const handleAddNewTag = useCallback(async () => {
    if (!newTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }

    const newTag = await addTag(newTagName.trim(), '#6C5CE7', selectedEmoji);
    if (newTag) {
      onTagsChange(prevSelectedTags => [...prevSelectedTags, newTag.id]);
      setNewTagName('');
      setSelectedEmoji('📝');
      toggleNewTagForm();
    }
  }, [newTagName, selectedEmoji, addTag, onTagsChange, toggleNewTagForm]);

  const toggleTagSelection = useCallback((tagId) => {
    onTagsChange(prevSelectedTags =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter(id => id !== tagId)
        : [...prevSelectedTags, tagId]
    );
  }, [onTagsChange]);

  const formHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <IconButton
          icon={showNewTagForm ? "close" : "plus"}
          size={20}
          onPress={toggleNewTagForm}
        />
      </View>

      <Animated.View style={[styles.newTagForm, { maxHeight: formHeight }]}>
        <View style={styles.formContent}>
          <TouchableOpacity
            style={styles.emojiSelector}
            onPress={() => setShowEmojiSelector(prev => !prev)}
          >
            <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
          </TouchableOpacity>

          <TextInput
            label="Category Name"
            value={newTagName}
            onChangeText={setNewTagName}
            mode="outlined"
            style={styles.tagInput}
            outlineColor="#008080"
            activeOutlineColor="#008080"
          />

          <IconButton
            icon="check"
            size={24}
            onPress={handleAddNewTag}
            style={styles.addButton}
          />
        </View>

        {showEmojiSelector && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiList}>
            <View style={styles.emojiGrid}>
              {EMOJI_LIST.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiItem}
                  onPress={() => {
                    setSelectedEmoji(emoji);
                    setShowEmojiSelector(false);
                  }}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagScrollView}
      >
        <View style={styles.tagContainer}>
          {allTags.map((tag) => (
            <Chip
              key={tag.id}
              mode="outlined"
              selected={selectedTags.includes(tag.id)}
              onPress={() => toggleTagSelection(tag.id)}
              style={[
                styles.tag,
                {
                  backgroundColor: selectedTags.includes(tag.id)
                    ? `${tag.color}15`
                    : 'transparent',
                  borderColor: tag.color,
                },
              ]}
              textStyle={{
                color: selectedTags.includes(tag.id)
                  ? tag.color
                  : '#666666',
              }}
            >
              {tag.icon} {tag.label || tag.name}
            </Chip>
          ))}
        </View>
      </ScrollView>
    </Surface>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008080',
  },
  newTagForm: {
    overflow: 'hidden',
    marginBottom: 16,
  },
  formContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  emojiSelector: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedEmoji: {
    fontSize: 24,
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#008080',
    borderRadius: 12,
  },
  emojiList: {
    maxHeight: 120,
    marginTop: 8,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  emojiItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  emoji: {
    fontSize: 20,
  },
  tagScrollView: {
    maxHeight: 120,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default TagSelector;