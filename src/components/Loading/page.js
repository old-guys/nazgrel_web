import React, { Component } from 'react';

export default function PageLoading(props) {
  // Handle the loading state
  if (props.isLoading) {
    return <div>Loading...</div>;
  }
  // Handle the error state
  else if (props.error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  }
  else {
    return null;
  }
}
