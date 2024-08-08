{{--
  Template Name: Game center
--}}

@extends('layouts.app')

@section('content')
  @while(have_posts()) @php(the_post())
    @include('partials.page-header')
    <div id="appGameCenterVue"></div>
    @include('partials.content-page')
  @endwhile
@endsection