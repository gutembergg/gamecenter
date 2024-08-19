{{--
  Template Name: Game center
--}}

@extends('layouts.app')

@section('content')
  @while(have_posts()) @php(the_post())
    <div id="appGameCenterVue"></div>
  @endwhile
@endsection